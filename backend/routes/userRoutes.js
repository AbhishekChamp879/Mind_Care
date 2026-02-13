import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { catchAsync, AppError } from "../middleware/errorHandler.js";
import { User } from "../models/user.js";
import { profileUpdateValidation } from "../middleware/validator.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";

const router = express.Router();

// Password change validation
const passwordChangeValidation = [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Password must contain uppercase, lowercase, and number"),
    validate,
];

/**
 * GET /api/users/profile - Get own profile
 */
router.get(
    "/users/profile",
    requireAuth(),
    catchAsync(async (req, res) => {
        const user = await User.findById(req.user.id);

        res.json({
            status: "success",
            data: { user },
        });
    })
);

/**
 * PATCH /api/users/profile - Update own profile
 */
router.patch(
    "/users/profile",
    requireAuth(),
    profileUpdateValidation,
    catchAsync(async (req, res, next) => {
        const allowedFields = [
            "name",
            "phone",
            "avatar",
            "dateOfBirth",
            "emergencyContact",
            "emergencyPhone",
            "preferredLanguage",
            "timezone",
            "university",
            "major",
            "year",
            "studentId",
            "license",
            "specialization",
            "experience",
            "department",
        ];

        const updates = {};
        Object.keys(req.body).forEach((key) => {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true,
        });

        res.json({
            status: "success",
            message: "Profile updated successfully",
            data: { user },
        });
    })
);

/**
 * POST /api/users/change-password - Change password
 */
router.post(
    "/users/change-password",
    requireAuth(),
    passwordChangeValidation,
    catchAsync(async (req, res, next) => {
        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await User.findById(req.user.id).select("+password");

        if (!user.password) {
            return next(
                new AppError("This account uses Google Sign-In and doesn't have a password", 400)
            );
        }

        // Verify current password
        const isValid = await comparePassword(currentPassword, user.password);
        if (!isValid) {
            return next(new AppError("Current password is incorrect", 401));
        }

        // Hash and save new password
        user.password = await hashPassword(newPassword);
        await user.save();

        res.json({
            status: "success",
            message: "Password changed successfully",
        });
    })
);

/**
 * GET /api/users/:id - Get user by ID (Admin/Counselor only)
 */
router.get(
    "/users/:id",
    requireAuth(["admin", "counselor"]),
    catchAsync(async (req, res, next) => {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        res.json({
            status: "success",
            data: { user },
        });
    })
);

/**
 * GET /api/users - List users (Admin only)
 */
router.get(
    "/users",
    requireAuth(["admin"]),
    catchAsync(async (req, res) => {
        const { role, isActive, page = 1, limit = 20, search } = req.query;

        const query = {};

        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === "true";
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

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
 * PATCH /api/users/:id - Update user (Admin only)
 */
router.patch(
    "/users/:id",
    requireAuth(["admin"]),
    catchAsync(async (req, res, next) => {
        const allowedFields = [
            "name",
            "role",
            "isActive",
            "permissions",
            "phone",
            "avatar",
        ];

        const updates = {};
        Object.keys(req.body).forEach((key) => {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        res.json({
            status: "success",
            message: "User updated successfully",
            data: { user },
        });
    })
);

/**
 * DELETE /api/users/:id - Deactivate user (Admin only)
 */
router.delete(
    "/users/:id",
    requireAuth(["admin"]),
    catchAsync(async (req, res, next) => {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        res.json({
            status: "success",
            message: "User deactivated successfully",
            data: { user },
        });
    })
);

export default router;
