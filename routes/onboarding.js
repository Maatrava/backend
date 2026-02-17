import express from "express";
import auth from "../middleware/auth.js";
import Onboarding from "../models/Onboarding.js";
import User from "../models/User.js";

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

        res.json(onboarding);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
