import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        maxlength: 500,
    },
    isAnonymous: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true,
});

const forumPostSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        maxlength: 200,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        maxlength: 5000,
    },
    category: {
        type: String,
        enum: ['anxiety', 'depression', 'stress', 'relationships', 'academic', 'general', 'crisis'],
        default: 'general',
        index: true,
    },
    tags: [String],
    isAnonymous: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    status: {
        type: String,
        enum: ['active', 'flagged', 'under-review', 'removed'],
        default: 'active',
        index: true,
    },
    flagCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
}, {
    timestamps: true,
});

// Indexes for efficient queries
forumPostSchema.index({ category: 1, createdAt: -1 });
forumPostSchema.index({ status: 1, createdAt: -1 });
forumPostSchema.index({ isPinned: -1, createdAt: -1 });

// Virtual for comment count
forumPostSchema.virtual('commentCount').get(function () {
    return this.comments.length;
});

// Virtual for like count
forumPostSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

export const ForumPost = mongoose.model("ForumPost", forumPostSchema);
