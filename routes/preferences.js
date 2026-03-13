import express from "express";
import UserPreference from "../models/UserPreference.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /api/user/preferences
router.get("/", auth, async (req, res) => {
    try {
        let preferences = await UserPreference.findOne({ userId: req.user });
        if (!preferences) {
            // Create default preferences if none exist
            preferences = new UserPreference({ userId: req.user });
            await preferences.save();
        }
        res.json(preferences);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/user/preferences
router.post("/", auth, async (req, res) => {
    try {
        const { theme, notificationSettings, interests } = req.body;
        const preferences = await UserPreference.findOneAndUpdate(
            { userId: req.user },
            { theme, notificationSettings, interests },
            { new: true, upsert: true }
        );
        res.json(preferences);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
