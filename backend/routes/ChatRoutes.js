import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Initialize AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Enable JSON body parsing
router.use(express.json());

// Chat endpoint
router.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    console.log("Sending request to Google GenAI with message:", message);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are "MindBuddy", a friendly and empathetic AI mental wellness assistant.
Provide emotional support, mental wellness advice, and coping strategies.
Never provide medical diagnoses or prescriptions.
Respond ONLY in JSON wrapped in a JSON code block.
User: "${message}"
Format:
\`\`\`json
{
  "text": "Your response message here",
  "severity": "low/medium/high/crisis",
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}
\`\`\`
      `,
    });

    console.log("Full AI response:", JSON.stringify(response, null, 2));

    // Extract the text from AI response
    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse JSON inside ```json code block
    let aiReply = { text: rawText, severity: "low", suggestions: [] };
    try {
      const match = rawText.match(/```json\s*([\s\S]*?)\s*```/i);
      if (match) {
        const parsed = JSON.parse(match[1]);
        aiReply.text = parsed.text || rawText;
        aiReply.severity = parsed.severity || "low";
        aiReply.suggestions = parsed.suggestions || [];
      }
    } catch (err) {
      console.warn("⚠️ Failed to parse AI JSON, using raw text", err);
    }

    // Send JSON response to frontend
    res.json({
      id: Date.now().toString(),
      sender: "ai",
      timestamp: new Date(),
      ...aiReply,
    });

  } catch (err) {
    console.error("GenAI SDK error:", err);
    res.status(500).json({
      id: Date.now().toString(),
      text: "Sorry, I'm having trouble responding right now. Please try again.",
      sender: "ai",
      timestamp: new Date(),
      severity: "low",
      suggestions: [],
    });
  }
});

export default router;
