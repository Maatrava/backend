import express from "express";
const router = express.Router();

import askAI from "../services/ai-services.js";

router.post("/chat", async (req, res) => {
    try {

        const { message } = req.body;

        const reply = await askAI(message);

        res.json({ reply });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI request failed" });
    }
});

export default router;