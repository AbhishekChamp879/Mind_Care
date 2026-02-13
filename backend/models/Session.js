import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    counselorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    scheduledTime: {
        type: Date,
        required: true,
        index: true,
    },
    duration: {
        type: Number,
        default: 60, // minutes
        min: 15,
        max: 180,
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'],
        default: 'scheduled',
        index: true,
    },
    type: {
        type: String,
        enum: ['individual', 'group', 'crisis', 'follow-up'],
        default: 'individual',
    },
    notes: {
        student: String,
        counselor: String,
    },
    meetingLink: String,
    cancelReason: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    feedback: String,
}, {
    timestamps: true,
});

// Compound indexes for efficient queries
sessionSchema.index({ studentId: 1, scheduledTime: -1 });
sessionSchema.index({ counselorId: 1, scheduledTime: -1 });
sessionSchema.index({ status: 1, scheduledTime: 1 });

// Virtual for checking if session is upcoming
sessionSchema.virtual('isUpcoming').get(function () {
    return this.scheduledTime > new Date() && this.status === 'scheduled';
});

export const Session = mongoose.model("Session", sessionSchema);
