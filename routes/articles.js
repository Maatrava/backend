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

// POST /api/articles/save (Toggle)
router.post("/save", auth, async (req, res) => {
  try {
    const { articleId } = req.body;
    if (!articleId) return res.status(400).json({ error: "Article ID is required" });

    // Check if it's already saved
    const existing = await SavedArticle.findOne({ userId: req.user, articleId });
    if (existing) {
      await SavedArticle.deleteOne({ _id: existing._id });
      return res.json({ message: "Article removed from saved", saved: false });
    }

    // Fetch article details to store in the saved table (though redundant)
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ error: "Article not found" });

    const savedArticle = new SavedArticle({
      userId: req.user,
      articleId,
      title: article.title,
      category: article.category,
      description: article.content, // user called it description
      url: article.url || "",
    });
    await savedArticle.save();
    res.json({ message: "Article saved successfully", saved: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/articles/saved
router.get("/saved", auth, async (req, res) => {
  try {
    const saved = await SavedArticle.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/articles/saved/:id
router.delete("/saved/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    // User might pass Article ID or specific SavedRecord ID. 
    // Let's check both or just assume it's the articleId since Cards use that.
    // User said SavedArticles table. I'll handle Article ID deletion.
    const result = await SavedArticle.deleteOne({
      userId: req.user,
      $or: [{ _id: id }, { articleId: id }]
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Saved article not found" });
    }
    res.json({ message: "Removed from saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
