import express from "express";
import auth from "../middleware/auth.js";
import Onboarding from "../models/Onboarding.js";
import User from "../models/User.js";
import UserPreference from "../models/UserPreference.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
    try {
        const { preferredLanguage, feedingType, babyAgeWeeks, deliveryType, helpFocus } = req.body;

        // Upsert onboarding data
        const onboarding = await Onboarding.findOneAndUpdate(
            { userId: req.user },
            {
                preferredLanguage,
                feedingType,
                babyAgeWeeks,
                deliveryType,
                helpFocus,
            },
            { new: true, upsert: true }
        );

        // Update user onboarding status
        await User.findByIdAndUpdate(req.user, { onboardingCompleted: true });

        // Save to UserPreference as well
        await UserPreference.findOneAndUpdate(
            { userId: req.user },
            {
                language: preferredLanguage,
                interests: helpFocus
            },
            { upsert: true }
        );

        res.json(onboarding);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
