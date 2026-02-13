import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { catchAsync, AppError } from "../middleware/errorHandler.js";
import { Session } from "../models/Session.js";
import { User } from "../models/user.js";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";

const router = express.Router();

// Validation for session booking
const sessionValidation = [
    body("counselorId").isMongoId().withMessage("Invalid counselor ID"),
    body("scheduledTime").isISO8601().withMessage("Invalid date format"),
    body("duration").optional().isInt({ min: 15, max: 180 }).withMessage("Duration must be between 15 and 180 minutes"),
    body("type").optional().isIn(["individual", "group", "crisis", "follow-up"]).withMessage("Invalid session type"),
    validate,
];

/**
 * GET /api/sessions - List user's sessions
 */
router.get(
    "/sessions",
    requireAuth(),
    catchAsync(async (req, res) => {
        const userId = req.user.id;
        const { status, page = 1, limit = 10 } = req.query;

        const query = {};

        // Filter by role
        if (req.user.role === "student") {
            query.studentId = userId;
        } else if (req.user.role === "counselor") {
            query.counselorId = userId;
        } else {
            // Admin can see all sessions
        }

        // Filter by status if provided
        if (status) {
            query.status = status;
        }

        const sessions = await Session.find(query)
            .populate("studentId", "name email avatar")
            .populate("counselorId", "name email avatar license specialization")
            .sort({ scheduledTime: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Session.countDocuments(query);

        res.json({
            status: "success",
            data: {
                sessions,
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
 * POST /api/sessions - Book new session (Students only)
 */
router.post(
    "/sessions",
    requireAuth(["student"]),
    sessionValidation,
    catchAsync(async (req, res, next) => {
        const { counselorId, scheduledTime, duration, type, notes } = req.body;
        const studentId = req.user.id;

        // Verify counselor exists
        const counselor = await User.findById(counselorId);
        if (!counselor || counselor.role !== "counselor") {
            return next(new AppError("Counselor not found", 404));
        }

        // Check if counselor is available at this time
        const existingSession = await Session.findOne({
            counselorId,
            scheduledTime: {
                $gte: new Date(scheduledTime),
                $lt: new Date(new Date(scheduledTime).getTime() + (duration || 60) * 60000),
            },
            status: { $in: ["scheduled", "in-progress"] },
        });

        if (existingSession) {
            return next(new AppError("Counselor is not available at this time", 400));
        }

        // Create session
        const session = await Session.create({
            studentId,
            counselorId,
            scheduledTime,
            duration: duration || 60,
            type: type || "individual",
            notes: { student: notes },
            meetingLink: `https://meet.mindcare.com/${Date.now()}`, // Generate meeting link
        });

        await session.populate("counselorId", "name email avatar license specialization");

        res.status(201).json({
            status: "success",
            message: "Session booked successfully",
            data: { session },
        });
    })
);

/**
 * GET /api/sessions/:id - Get session details
 */
router.get(
    "/sessions/:id",
    requireAuth(),
    catchAsync(async (req, res, next) => {
        const session = await Session.findById(req.params.id)
            .populate("studentId", "name email avatar university major")
            .populate("counselorId", "name email avatar license specialization");

        if (!session) {
            return next(new AppError("Session not found", 404));
        }

        // Check authorization
        const userId = req.user.id;
        const isAuthorized =
            session.studentId._id.toString() === userId ||
            session.counselorId._id.toString() === userId ||
            req.user.role === "admin";

        if (!isAuthorized) {
            return next(new AppError("You are not authorized to view this session", 403));
        }

        res.json({
            status: "success",
            data: { session },
        });
    })
);

/**
 * PATCH /api/sessions/:id - Update session
 */
router.patch(
    "/sessions/:id",
    requireAuth(["student", "counselor"]),
    catchAsync(async (req, res, next) => {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return next(new AppError("Session not found", 404));
        }

        const userId = req.user.id;
        const isStudent = session.studentId.toString() === userId;
        const isCounselor = session.counselorId.toString() === userId;

        if (!isStudent && !isCounselor) {
            return next(new AppError("You are not authorized to update this session", 403));
        }

        // Students can update their notes and cancel
        if (isStudent) {
            if (req.body.notes) session.notes.student = req.body.notes;
            if (req.body.status === "cancelled") {
                session.status = "cancelled";
                session.cancelReason = req.body.cancelReason;
            }
        }

        // Counselors can update their notes, status, and add ratings
        if (isCounselor) {
            if (req.body.notes) session.notes.counselor = req.body.notes;
            if (req.body.status) session.status = req.body.status;
            if (req.body.rating) session.rating = req.body.rating;
            if (req.body.feedback) session.feedback = req.body.feedback;
        }

        await session.save();

        res.json({
            status: "success",
            message: "Session updated successfully",
            data: { session },
        });
    })
);

/**
 * DELETE /api/sessions/:id - Cancel session (Students only)
 */
router.delete(
    "/sessions/:id",
    requireAuth(["student"]),
    catchAsync(async (req, res, next) => {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return next(new AppError("Session not found", 404));
        }

        if (session.studentId.toString() !== req.user.id) {
            return next(new AppError("You are not authorized to cancel this session", 403));
        }

        if (session.status !== "scheduled") {
            return next(new AppError("Only scheduled sessions can be cancelled", 400));
        }

        session.status = "cancelled";
        session.cancelReason = req.body.reason || "Cancelled by student";
        await session.save();

        res.json({
            status: "success",
            message: "Session cancelled successfully",
            data: { session },
        });
    })
);

/**
 * GET /api/counselors - List available counselors
 */
router.get(
    "/counselors",
    requireAuth(),
    catchAsync(async (req, res) => {
        const { specialization, page = 1, limit = 10 } = req.query;

        const query = { role: "counselor", isActive: true };

        if (specialization) {
            query.specialization = specialization;
        }

        const counselors = await User.find(query)
            .select("name email avatar license specialization experience")
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.json({
            status: "success",
            data: {
                counselors,
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
