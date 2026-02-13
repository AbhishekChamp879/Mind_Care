import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { requireAuth } from "../middleware/authMiddleware.js";
import { chatLimiter } from "../middleware/rateLimiter.js";
import { chatValidation } from "../middleware/validator.js";
import { catchAsync, AppError } from "../middleware/errorHandler.js";
import { ChatMessage } from "../models/ChatMessage.js";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const router = express.Router();

// Initialize AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * POST /api/chat - Send message to AI (Protected)
 */
router.post(
  "/chat",
  requireAuth(), // Authentication required
  chatLimiter, // Rate limiting
  chatValidation, // Input validation
  catchAsync(async (req, res, next) => {
    const { message, conversationId } = req.body;
    const userId = req.user.id;

    // Generate conversation ID if not provided
    const convId = conversationId || uuidv4();

    // Get conversation history for context (last 10 messages)
    const history = await ChatMessage.find({
      userId,
      conversationId: convId,
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    // Build context from history
    const contextMessages = history
      .reverse()
      .map((msg) => {
        if (msg.sender === "user") {
          return `User: ${msg.message}`;
        } else {
          return `MindBuddy: ${msg.aiResponse?.text || msg.message}`;
        }
      })
      .join("\\n");

    // Save user message to database
    const userMessage = await ChatMessage.create({
      userId,
      conversationId: convId,
      message,
      sender: "user",
    });

    try {
      console.log("Sending request to Google GenAI with message:", message);

      // Build AI prompt with context
      const prompt = `
You are "MindBuddy", a friendly and empathetic AI mental wellness assistant.
Provide emotional support, mental wellness advice, and coping strategies.
Never provide medical diagnoses or prescriptions.
Be compassionate, understanding, and supportive.

${contextMessages ? `Previous conversation context:\\n${contextMessages}\\n` : ""}

Current user message: "${message}"

Respond ONLY in JSON format wrapped in a JSON code block.
Format:
\`\`\`json
{
  "text": "Your empathetic and supportive response here",
  "severity": "low/medium/high/crisis",
  "suggestions": ["Helpful suggestion 1", "Helpful suggestion 2", "Helpful suggestion 3"]
}
\`\`\`

Severity levels:
- low: General conversation, positive mood
- medium: Some stress, anxiety, or concerns
- high: Significant distress, panic, or breakdown
- crisis: Mentions of self-harm, suicide, or immediate danger

For crisis situations, ALWAYS include emergency resources in your response.
`;

      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-2.0-flash-exp",
        contents: prompt,
      });

      console.log("Full AI response received");

      // Extract the text from AI response
      const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Parse JSON inside ```json code block
      let aiReply = { text: rawText, severity: "low", suggestions: [] };
      try {
        const match = rawText.match(/```json\\s*([\\s\\S]*?)\\s*```/i);
        if (match) {
          const parsed = JSON.parse(match[1]);
          aiReply.text = parsed.text || rawText;
          aiReply.severity = parsed.severity || "low";
          aiReply.suggestions = parsed.suggestions || [];
        }
      } catch (err) {
        console.warn("⚠️ Failed to parse AI JSON, using raw text", err);
      }

      // Save AI response to database
      const aiMessage = await ChatMessage.create({
        userId,
        conversationId: convId,
        message: aiReply.text,
        sender: "ai",
        aiResponse: {
          text: aiReply.text,
          severity: aiReply.severity,
          suggestions: aiReply.suggestions,
        },
      });

      // Send JSON response to frontend
      res.json({
        status: "success",
        data: {
          id: aiMessage._id.toString(),
          conversationId: convId,
          sender: "ai",
          timestamp: aiMessage.timestamp,
          text: aiReply.text,
          severity: aiReply.severity,
          suggestions: aiReply.suggestions,
        },
      });
    } catch (err) {
      console.error("GenAI SDK error:", err);

      // Save error response
      const errorMessage = await ChatMessage.create({
        userId,
        conversationId: convId,
        message: "Sorry, I'm having trouble responding right now. Please try again.",
        sender: "ai",
        aiResponse: {
          text: "Sorry, I'm having trouble responding right now. Please try again.",
          severity: "low",
          suggestions: ["Try again", "Contact support"],
        },
      });

      res.status(500).json({
        status: "error",
        data: {
          id: errorMessage._id.toString(),
          conversationId: convId,
          text: "Sorry, I'm having trouble responding right now. Please try again.",
          sender: "ai",
          timestamp: errorMessage.timestamp,
          severity: "low",
          suggestions: ["Try again", "Contact support"],
        },
      });
    }
  })
);

/**
 * GET /api/chat/history - Get user's chat conversations
 */
router.get(
  "/chat/history",
  requireAuth(),
  catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    // Get unique conversation IDs
    const conversations = await ChatMessage.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" },
          messageCount: { $sum: 1 },
        },
      },
      { $sort: { "lastMessage.timestamp": -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
    ]);

    res.json({
      status: "success",
      data: {
        conversations,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  })
);

/**
 * GET /api/chat/conversation/:id - Get specific conversation
 */
router.get(
  "/chat/conversation/:id",
  requireAuth(),
  catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const conversationId = req.params.id;

    const messages = await ChatMessage.find({
      userId,
      conversationId,
    }).sort({ timestamp: 1 });

    if (!messages.length) {
      return next(new AppError("Conversation not found", 404));
    }

    res.json({
      status: "success",
      data: {
        conversationId,
        messages,
      },
    });
  })
);

/**
 * DELETE /api/chat/conversation/:id - Delete conversation
 */
router.delete(
  "/chat/conversation/:id",
  requireAuth(),
  catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const conversationId = req.params.id;

    const result = await ChatMessage.deleteMany({
      userId,
      conversationId,
    });

    if (result.deletedCount === 0) {
      return next(new AppError("Conversation not found", 404));
    }

    res.json({
      status: "success",
      message: "Conversation deleted successfully",
      deletedCount: result.deletedCount,
    });
  })
);

export default router;
