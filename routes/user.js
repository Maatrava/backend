import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

import bcrypt from "bcryptjs";

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
        const { name, phone, password } = req.body;
        const updateData = { name, phone };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user,
            updateData,
            { new: true }
        ).select("-password");
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;
