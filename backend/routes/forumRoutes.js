import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { catchAsync, AppError } from "../middleware/errorHandler.js";
import { ForumPost } from "../models/ForumPost.js";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";

const router = express.Router();

// Validation for forum posts
const postValidation = [
    body("title").trim().isLength({ min: 5, max: 200 }).withMessage("Title must be between 5 and 200 characters"),
    body("content").trim().isLength({ min: 10, max: 5000 }).withMessage("Content must be between 10 and 5000 characters"),
    body("category").optional().isIn(["anxiety", "depression", "stress", "relationships", "academic", "general", "crisis"]),
    body("isAnonymous").optional().isBoolean(),
    validate,
];

const commentValidation = [
    body("content").trim().isLength({ min: 1, max: 500 }).withMessage("Comment must be between 1 and 500 characters"),
    body("isAnonymous").optional().isBoolean(),
    validate,
];

/**
 * GET /api/forum/posts - List forum posts
 */
router.get(
    "/forum/posts",
    requireAuth(),
    catchAsync(async (req, res) => {
        const { category, status = "active", page = 1, limit = 20, sort = "-createdAt" } = req.query;

        const query = { status };

        if (category) {
            query.category = category;
        }

        const posts = await ForumPost.find(query)
            .populate("authorId", "name avatar role")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        // Hide author info for anonymous posts
        posts.forEach((post) => {
            if (post.isAnonymous) {
                post.authorId = { name: "Anonymous", avatar: null, role: "student" };
            }
            post.likeCount = post.likes.length;
            post.commentCount = post.comments.length;
            delete post.likes; // Don't send full likes array
        });

        const total = await ForumPost.countDocuments(query);

        res.json({
            status: "success",
            data: {
                posts,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    })
);

/**
 * POST /api/forum/posts - Create new post
 */
router.post(
    "/forum/posts",
    requireAuth(),
    postValidation,
    catchAsync(async (req, res) => {
        const { title, content, category, tags, isAnonymous } = req.body;

        const post = await ForumPost.create({
            authorId: req.user.id,
            title,
            content,
            category: category || "general",
            tags: tags || [],
            isAnonymous: isAnonymous || false,
        });

        await post.populate("authorId", "name avatar role");

        res.status(201).json({
            status: "success",
            message: "Post created successfully",
            data: { post },
        });
    })
);

/**
 * GET /api/forum/posts/:id - Get post details
 */
router.get(
    "/forum/posts/:id",
    requireAuth(),
    catchAsync(async (req, res, next) => {
        const post = await ForumPost.findById(req.params.id)
            .populate("authorId", "name avatar role")
            .populate("comments.authorId", "name avatar role")
            .lean();

        if (!post) {
            return next(new AppError("Post not found", 404));
        }

        // Increment view count
        await ForumPost.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

        // Hide author info for anonymous posts
        if (post.isAnonymous) {
            post.authorId = { name: "Anonymous", avatar: null, role: "student" };
        }

        // Hide comment authors for anonymous comments
        post.comments.forEach((comment) => {
            if (comment.isAnonymous) {
                comment.authorId = { name: "Anonymous", avatar: null, role: "student" };
            }
        });

        post.likeCount = post.likes.length;
        post.isLiked = post.likes.some((id) => id.toString() === req.user.id);
        delete post.likes;

        res.json({
            status: "success",
            data: { post },
        });
    })
);

/**
 * POST /api/forum/posts/:id/comments - Add comment to post
 */
router.post(
    "/forum/posts/:id/comments",
    requireAuth(),
    commentValidation,
    catchAsync(async (req, res, next) => {
        const { content, isAnonymous } = req.body;

        const post = await ForumPost.findById(req.params.id);

        if (!post) {
            return next(new AppError("Post not found", 404));
        }

        post.comments.push({
            authorId: req.user.id,
            content,
            isAnonymous: isAnonymous || false,
        });

        await post.save();
        await post.populate("comments.authorId", "name avatar role");

        const newComment = post.comments[post.comments.length - 1];

        res.status(201).json({
            status: "success",
            message: "Comment added successfully",
            data: { comment: newComment },
        });
    })
);

/**
 * POST /api/forum/posts/:id/like - Like/unlike post
 */
router.post(
    "/forum/posts/:id/like",
    requireAuth(),
    catchAsync(async (req, res, next) => {
        const post = await ForumPost.findById(req.params.id);

        if (!post) {
            return next(new AppError("Post not found", 404));
        }

        const userId = req.user.id;
        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex > -1) {
            // Unlike
            post.likes.splice(likeIndex, 1);
        } else {
            // Like
            post.likes.push(userId);
        }

        await post.save();

        res.json({
            status: "success",
            message: likeIndex > -1 ? "Post unliked" : "Post liked",
            data: {
                likeCount: post.likes.length,
                isLiked: likeIndex === -1,
            },
        });
    })
);

/**
 * DELETE /api/forum/posts/:id - Delete post (Author or Admin only)
 */
router.delete(
    "/forum/posts/:id",
    requireAuth(),
    catchAsync(async (req, res, next) => {
        const post = await ForumPost.findById(req.params.id);

        if (!post) {
            return next(new AppError("Post not found", 404));
        }

        const isAuthor = post.authorId.toString() === req.user.id;
        const isAdmin = req.user.role === "admin";

        if (!isAuthor && !isAdmin) {
            return next(new AppError("You are not authorized to delete this post", 403));
        }

        if (isAdmin) {
            // Admin can mark as removed
            post.status = "removed";
            await post.save();
        } else {
            // Author can delete
            await post.deleteOne();
        }

        res.json({
            status: "success",
            message: "Post deleted successfully",
        });
    })
);

/**
 * POST /api/forum/posts/:id/flag - Flag post for moderation
 */
router.post(
    "/forum/posts/:id/flag",
    requireAuth(),
    catchAsync(async (req, res, next) => {
        const post = await ForumPost.findById(req.params.id);

        if (!post) {
            return next(new AppError("Post not found", 404));
        }

        post.flagCount += 1;

        // Auto-flag for review if flagged 3+ times
        if (post.flagCount >= 3 && post.status === "active") {
            post.status = "flagged";
        }

        await post.save();

        res.json({
            status: "success",
            message: "Post flagged for review",
        });
    })
);

export default router;
