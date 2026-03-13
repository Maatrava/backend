import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import mongoose from "mongoose";
import { sendResetPasswordEmail } from "../services/email-service.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        console.log(`Signup attempt: ${email}`);

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please enter all fields" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

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
            phone,
        });
        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

        res.json({
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                phone: savedUser.phone,
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
                email: user.email,
                onboardingCompleted: user.onboardingCompleted,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "No user found with this email" });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        await sendResetPasswordEmail(email, resetToken);

        res.json({ message: "Password reset link sent to your email" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ error: "Token and new password are required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(newPassword, salt);

        await User.findByIdAndUpdate(decoded.id, { password: passwordHash });

        res.json({ message: "Password has been reset successfully" });
    } catch (err) {
        res.status(400).json({ error: "Invalid or expired token" });
    }
});

// Google Login
router.post("/google", async (req, res) => {
    try {
        const { credential } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if they don't exist
            user = new User({
                name,
                email,
                googleId,
                // No password for Google users
            });
            await user.save();
        } else if (!user.googleId) {
            // If user exists but was registered via email, link Google account
            user.googleId = googleId;
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                onboardingCompleted: user.onboardingCompleted,
                picture: picture, // Include picture from Google
            },
        });
    } catch (err) {
        console.error("Google verify error:", err);
        res.status(401).json({ error: "Invalid Google token" });
    }
});

// Get User
router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        onboardingCompleted: user.onboardingCompleted,
    });
});

export default router;

