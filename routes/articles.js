import express from "express";
import Article from "../models/Article.js";
import SavedArticle from "../models/SavedArticle.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /api/articles
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const articles = await Article.find(query).sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/articles/save
router.post("/save", auth, async (req, res) => {
  try {
    const { articleId } = req.body;
    if (!articleId) return res.status(400).json({ error: "Article ID is required" });

    const savedArticle = new SavedArticle({
      userId: req.user,
      articleId,
    });
    await savedArticle.save();
    res.json({ message: "Article saved successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Article already saved" });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /api/articles/saved
router.get("/saved", auth, async (req, res) => {
  try {
    const saved = await SavedArticle.find({ userId: req.user }).populate("articleId");
    res.json(saved.map(s => s.articleId).filter(a => a != null));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
