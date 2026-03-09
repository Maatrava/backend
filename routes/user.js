import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /api/user/profile
router.get("/profile", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/user/profile
router.put("/profile", auth, async (req, res) => {
    try {
        const { name, phone } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user,
            { name, phone },
            { new: true }
        ).select("-password");
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
