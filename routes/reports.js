import express from "express";
import User from "../models/User.js";
import UserPreference from "../models/UserPreference.js";
import SavedArticle from "../models/SavedArticle.js";
import ChatMessage from "../models/ChatMessage.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /api/reports/profile
router.get("/profile", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password");
        const preferences = await UserPreference.findOne({ userId: req.user });
        const savedArticles = await SavedArticle.find({ userId: req.user }).populate("articleId");

        res.json({
            user,
            preferences,
            savedArticles: savedArticles.map(s => s.articleId),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/reports/preferences
router.get("/preferences", auth, async (req, res) => {
    try {
        const preferences = await UserPreference.findOne({ userId: req.user });
        res.json(preferences || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/reports/activity
router.get("/activity", auth, async (req, res) => {
    try {
        // For now, simpler activity report based on known models
        const chatCount = await ChatMessage.countDocuments({ userId: req.user });
        const savedCount = await SavedArticle.countDocuments({ userId: req.user });
        const user = await User.findById(req.user).select("createdAt updatedAt");

        res.json({
            accountCreated: user.createdAt,
            lastProfileUpdate: user.updatedAt,
            totalChatMessages: chatCount,
            totalSavedArticles: savedCount,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/reports/chat
router.get("/chat", auth, async (req, res) => {
    try {
        const history = await ChatMessage.find({ userId: req.user }).sort({ createdAt: 1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
