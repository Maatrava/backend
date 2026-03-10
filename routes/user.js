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
        const { name, email, phone, password, profilePicture } = req.body;

        // Validation
        if (!name || name.trim() === "") {
            return res.status(400).json({ error: "Name is required" });
        }

        if (!email || email.trim() === "") {
            return res.status(400).json({ error: "Email is required" });
        }

        if (phone && !/^\+?[\d\s-]{10,}$/.test(phone)) {
            return res.status(400).json({ error: "Invalid phone number format" });
        }

        const updateData = { name, email, phone, profilePicture };

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
