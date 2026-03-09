import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import UserPreference from "../models/UserPreference.js";
import SavedArticle from "../models/SavedArticle.js";
import ChatMessage from "../models/ChatMessage.js";
import auth from "../middleware/auth.js";
import MotherForm from "../models/MotherForm.js";
import MotherHealthRecord from "../models/MotherHealthRecord.js";
import BabyHealthRecord from "../models/BabyHealthRecord.js";
import FeedingLog from "../models/FeedingLog.js";
import SleepLog from "../models/SleepLog.js";
import Article from "../models/Article.js";

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

// GET /api/reports/insights
router.get("/insights", auth, async (req, res) => {
    try {
        const userId = req.user;

        // 1. Mother Recovery
        const motherForm = await MotherForm.findOne({ userId });
        const deliveryDate = motherForm && motherForm.deliveryDate ? new Date(motherForm.deliveryDate) : null;
        const daysSinceDelivery = deliveryDate ? Math.floor((new Date() - deliveryDate) / (1000 * 60 * 60 * 24)) : 0;
        const recoveryCheckIns = await MotherHealthRecord.countDocuments({ userId });
        const lastHealthUpdate = await MotherHealthRecord.findOne({ userId }).sort({ checkInDate: -1 });

        // 2. Baby Growth
        const babyHistory = await BabyHealthRecord.find({ userId }).sort({ logDate: 1 });
        const babyAgeDays = deliveryDate ? Math.floor((new Date() - deliveryDate) / (1000 * 60 * 60 * 24)) : 0;

        // 3. Feeding
        const feedingLogs = await FeedingLog.find({ userId });
        const feedingTypeDist = await FeedingLog.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$feedingType", count: { $sum: 1 } } }
        ]);

        // 4. Sleep
        const sleepLogs = await SleepLog.find({ userId }).sort({ logDate: -1 });
        const avgSleep = await SleepLog.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, avgDuration: { $avg: "$totalDuration" } } }
        ]);

        // 5. Engagement
        const readArticlesCount = await Article.countDocuments({}); // Placeholder for read tracking
        const savedArticlesCount = await SavedArticle.countDocuments({ userId });

        // 6. AI Usage
        const chatStats = await ChatMessage.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), sender: "user" } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        const totalQuestions = await ChatMessage.countDocuments({ userId, sender: "user" });

        // 7. Personalization
        const prefs = await UserPreference.findOne({ userId });

        res.json({
            summary: {
                daysSinceDelivery,
                babyAgeDays,
                feedingLogsCount: feedingLogs.length,
                sleepLogsCount: sleepLogs.length,
                aiQuestionsCount: totalQuestions
            },
            motherRecovery: {
                daysSinceDelivery,
                recoveryCheckIns,
                lastHealthUpdate: lastHealthUpdate ? lastHealthUpdate.checkInDate : null,
            },
            babyGrowth: {
                history: babyHistory
            },
            feeding: {
                totalEntries: feedingLogs.length,
                distribution: feedingTypeDist
            },
            sleep: {
                totalSessions: sleepLogs.length,
                avgDurationMinutes: avgSleep.length > 0 ? avgSleep[0].avgDuration : 0,
                recentLogs: sleepLogs.slice(0, 10)
            },
            learning: {
                articlesRead: readArticlesCount,
                articlesSaved: savedArticlesCount
            },
            aiUsage: {
                totalQuestions,
                activityTimeline: chatStats
            },
            personalization: {
                language: prefs?.language,
                interests: prefs?.interests
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
