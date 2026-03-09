import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import MotherForm from "./models/MotherForm.js";
import MotherHealthRecord from "./models/MotherHealthRecord.js";
import BabyHealthRecord from "./models/BabyHealthRecord.js";
import FeedingLog from "./models/FeedingLog.js";
import SleepLog from "./models/SleepLog.js";
import ChatMessage from "./models/ChatMessage.js";

dotenv.config();

const seedInsightsData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding insights...");

        const users = await User.find({});
        if (users.length === 0) {
            console.log("No users found. Please sign up first.");
            process.exit();
        }

        const user = users[0];
        const userId = user._id;

        // 1. Mother Form (Delivery Date)
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() - 14); // 2 weeks ago
        await MotherForm.findOneAndUpdate(
            { userId },
            { deliveryDate: deliveryDate.toISOString(), personalName: user.name },
            { upsert: true }
        );

        // 2. Mother Health Records
        const motherRecords = [
            { userId, bp: "120/80", weight: 65, temperature: 36.6, pulse: 72, mood: "Good", painLevel: 2, checkInDate: new Date(Date.now() - 86400000 * 2) },
            { userId, bp: "118/78", weight: 64.5, temperature: 36.5, pulse: 70, mood: "Relaxed", painLevel: 1, checkInDate: new Date(Date.now() - 86400000 * 1) },
            { userId, bp: "122/82", weight: 64.8, temperature: 36.7, pulse: 75, mood: "Tired", painLevel: 3, checkInDate: new Date() },
        ];
        await MotherHealthRecord.deleteMany({ userId });
        await MotherHealthRecord.insertMany(motherRecords);

        // 3. Baby Health Records
        const babyHistory = [
            { userId, weight: 3.2, height: 50, headCircumference: 34, temperature: 36.5, logDate: new Date(deliveryDate) },
            { userId, weight: 3.5, height: 51, headCircumference: 34.5, temperature: 36.6, logDate: new Date(deliveryDate.getTime() + 86400000 * 7) },
            { userId, weight: 3.8, height: 52, headCircumference: 35, temperature: 36.7, logDate: new Date() },
        ];
        await BabyHealthRecord.deleteMany({ userId });
        await BabyHealthRecord.insertMany(babyHistory);

        // 4. Feeding Logs
        const feedingLogs = [
            { userId, feedingType: "Breastfeeding", duration: 20, side: "Left", logDate: new Date(Date.now() - 3600000 * 4) },
            { userId, feedingType: "Formula", amount: 60, logDate: new Date(Date.now() - 3600000 * 8) },
            { userId, feedingType: "Breastfeeding", duration: 15, side: "Right", logDate: new Date(Date.now() - 3600000 * 12) },
        ];
        await FeedingLog.deleteMany({ userId });
        await FeedingLog.insertMany(feedingLogs);

        // 5. Sleep Logs
        const sleepLogs = [
            { userId, startTime: new Date(Date.now() - 3600000 * 14), endTime: new Date(Date.now() - 3600000 * 18), totalDuration: 240, quality: "Calm" },
            { userId, startTime: new Date(Date.now() - 3600000 * 24), endTime: new Date(Date.now() - 3600000 * 28), totalDuration: 240, quality: "Restless" },
        ];
        await SleepLog.deleteMany({ userId });
        await SleepLog.insertMany(sleepLogs);

        // 6. Chat Messages
        const chatMsgs = [
            { userId, message: "What should I eat for recovery?", sender: "user" },
            { userId, message: "Focus on protein and iron-rich foods.", sender: "ai" },
            { userId, message: "How often should I feed the baby?", sender: "user" },
            { userId, message: "Every 2-3 hours usually.", sender: "ai" },
        ];
        await ChatMessage.deleteMany({ userId });
        await ChatMessage.insertMany(chatMsgs);

        console.log("Insights data seeded successfully!");
        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedInsightsData();
