import express from "express";
import Message from "../models/Message.js";
import authOptional from "../middleware/authOptional.js";

const router = express.Router();

router.post("/", authOptional, async (req, res) => {
    try {
        const { name, email, content } = req.body;
        if (!name || !email || !content) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newMessage = new Message({
            userId: req.user, // May be null if not logged in
            name,
            email,
            content,
        });

        await newMessage.save();
        res.json({ message: "Message sent successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
