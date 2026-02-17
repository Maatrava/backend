import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(`Signup attempt: ${email}`);
        console.log(`Mongoose connection state: ${mongoose.connection.readyState}`);

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please enter all fields" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        console.log("Checking for existing user...");
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "An account with this email already exists" });
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: passwordHash,
        });
        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

        res.json({
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                onboardingCompleted: savedUser.onboardingCompleted,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Not all fields have been entered" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "No account with this email has been registered" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                onboardingCompleted: user.onboardingCompleted,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User
router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
    });
});

export default router;
