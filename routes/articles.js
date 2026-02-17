import express from "express";
import { getDailyArticles } from "../services/medlineplus.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const max = Math.min(Number(req.query.max || 7), 10);
  const data = await getDailyArticles(max);
  res.json(data);
});

export default router;