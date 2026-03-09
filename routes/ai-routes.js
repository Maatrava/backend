import express from "express";
import ChatMessage from "../models/ChatMessage.js";
import auth from "../middleware/auth.js";
import askAI from "../services/ai-services.js";

const router = express.Router();

// POST /api/chat
router.post("/chat", auth, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        // Save User Message
        const userMsg = new ChatMessage({
            userId: req.user,
            message,
            sender: "user",
        });
        await userMsg.save();

        // Get AI Response
        const reply = await askAI(message);

        // Save AI Message
        const aiMsg = new ChatMessage({
            userId: req.user,
            message: reply,
            sender: "ai",
        });
        await aiMsg.save();

        res.json({ reply });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI request failed" });
    }
});

// GET /api/chat/history
router.get("/chat/history", auth, async (req, res) => {
    try {
        const history = await ChatMessage.find({ userId: req.user }).sort({ createdAt: 1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
