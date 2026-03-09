import mongoose from "mongoose";

const savedArticleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
}, { timestamps: true });

// Ensure a user can't save the same article twice
savedArticleSchema.index({ userId: 1, articleId: 1 }, { unique: true });

const SavedArticle = mongoose.model("SavedArticle", savedArticleSchema);
export default SavedArticle;
