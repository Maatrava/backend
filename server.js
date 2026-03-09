import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import onboardingRoutes from "./routes/onboarding.js";
import articlesRoutes from "./routes/articles.js";
import motherFormRoutes from "./routes/motherForm.js";
import aiRoutes from "./routes/ai-routes.js";
import appointmentsRoutes from "./routes/appointments.js";
import userRoutes from "./routes/user.js";
import preferencesRoutes from "./routes/preferences.js";
import reportsRoutes from "./routes/reports.js";
import messagesRoutes from "./routes/messages.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running ");
});
app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/mother-form", motherFormRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user/preferences", preferencesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api", aiRoutes);



app.use("/api/appointments", appointmentsRoutes);


// MongoDB Connection & Server Start
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose.set("bufferCommands", false); // Disable buffering to see immediate errors

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
