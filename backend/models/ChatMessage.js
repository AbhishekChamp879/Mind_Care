import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    conversationId: {
        type: String,
        required: true,
        index: true,
    },
    message: {
        type: String,
        required: true,
        maxlength: 1000,
    },
    sender: {
        type: String,
        enum: ['user', 'ai'],
        required: true,
    },
    aiResponse: {
        text: String,
        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'crisis'],
            default: 'low',
        },
        suggestions: [String],
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true,
    },
}, {
    timestamps: true,
});

// Compound index for efficient queries
chatMessageSchema.index({ userId: 1, timestamp: -1 });
chatMessageSchema.index({ conversationId: 1, timestamp: 1 });

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
