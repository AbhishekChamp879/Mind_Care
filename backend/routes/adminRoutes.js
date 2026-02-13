import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { catchAsync } from "../middleware/errorHandler.js";
import { User } from "../models/user.js";
import { Session } from "../models/Session.js";
import { ChatMessage } from "../models/ChatMessage.js";
import { ForumPost } from "../models/ForumPost.js";
import mongoose from "mongoose";

const router = express.Router();

/**
 * GET /api/admin/analytics - Platform analytics (Admin only)
 */
router.get(
    "/admin/analytics",
    requireAuth(["admin"]),
    catchAsync(async (req, res) => {
        const { period = "30d" } = req.query;

        // Calculate date range
        const daysAgo = parseInt(period) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);

        // User statistics
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const newUsers = await User.countDocuments({
            createdAt: { $gte: startDate },
        });

        const usersByRole = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } },
        ]);

        // Session statistics
        const totalSessions = await Session.countDocuments();
        const completedSessions = await Session.countDocuments({ status: "completed" });
        const upcomingSessions = await Session.countDocuments({
            status: "scheduled",
            scheduledTime: { $gte: new Date() },
        });

        const sessionsByStatus = await Session.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        // Chat statistics
        const totalChats = await ChatMessage.countDocuments();
        const recentChats = await ChatMessage.countDocuments({
            timestamp: { $gte: startDate },
        });

        const chatsBySeverity = await ChatMessage.aggregate([
            { $match: { sender: "ai" } },
            { $group: { _id: "$aiResponse.severity", count: { $sum: 1 } } },
        ]);

        // Forum statistics
        const totalPosts = await ForumPost.countDocuments();
        const activePosts = await ForumPost.countDocuments({ status: "active" });
        const flaggedPosts = await ForumPost.countDocuments({ status: "flagged" });

        const postsByCategory = await ForumPost.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
        ]);

        // User activity over time
        const userActivity = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json({
            status: "success",
            data: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    new: newUsers,
                    byRole: usersByRole,
                },
                sessions: {
                    total: totalSessions,
                    completed: completedSessions,
                    upcoming: upcomingSessions,
                    byStatus: sessionsByStatus,
                },
                chats: {
                    total: totalChats,
                    recent: recentChats,
                    bySeverity: chatsBySeverity,
                },
                forum: {
                    total: totalPosts,
                    active: activePosts,
                    flagged: flaggedPosts,
                    byCategory: postsByCategory,
                },
                activity: {
                    userSignups: userActivity,
                },
                period: `${daysAgo} days`,
            },
        });
    })
);

/**
 * GET /api/admin/users - User management (Admin only)
 */
router.get(
    "/admin/users",
    requireAuth(["admin"]),
    catchAsync(async (req, res) => {
        const { role, status, page = 1, limit = 20 } = req.query;

        const query = {};
        if (role) query.role = role;
        if (status === "active") query.isActive = true;
        if (status === "inactive") query.isActive = false;

        const users = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.json({
            status: "success",
            data: {
                users,
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
 * GET /api/admin/reports - Crisis reports (Admin only)
 */
router.get(
    "/admin/reports",
    requireAuth(["admin"]),
    catchAsync(async (req, res) => {
        const { page = 1, limit = 20 } = req.query;

        // Get crisis-level chat messages
        const crisisChats = await ChatMessage.find({
            "aiResponse.severity": "crisis",
        })
            .populate("userId", "name email phone role")
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await ChatMessage.countDocuments({
            "aiResponse.severity": "crisis",
        });

        res.json({
            status: "success",
            data: {
                reports: crisisChats,
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
 * GET /api/admin/system-health - System health metrics (Admin only)
 */
router.get(
    "/admin/system-health",
    requireAuth(["admin"]),
    catchAsync(async (req, res) => {
        // Database connection status
        const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";

        // Memory usage
        const memoryUsage = process.memoryUsage();

        // Uptime
        const uptime = process.uptime();

        // Recent errors (you would implement error logging)
        const recentErrors = [];

        // Active sessions count
        const activeSessions = await Session.countDocuments({
            status: "in-progress",
        });

        res.json({
            status: "success",
            data: {
                database: {
                    status: dbStatus,
                    name: mongoose.connection.name,
                },
                server: {
                    uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
                    memory: {
                        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                    },
                    nodeVersion: process.version,
                    environment: process.env.NODE_ENV || "development",
                },
                activity: {
                    activeSessions,
                },
                errors: recentErrors,
            },
        });
    })
);

/**
 * GET /api/admin/moderation - Content moderation queue (Admin only)
 */
router.get(
    "/admin/moderation",
    requireAuth(["admin"]),
    catchAsync(async (req, res) => {
        const { page = 1, limit = 20 } = req.query;

        // Get flagged posts
        const flaggedPosts = await ForumPost.find({
            status: { $in: ["flagged", "under-review"] },
        })
            .populate("authorId", "name email role")
            .sort({ flagCount: -1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await ForumPost.countDocuments({
            status: { $in: ["flagged", "under-review"] },
        });

        res.json({
            status: "success",
            data: {
                posts: flaggedPosts,
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

export default router;
