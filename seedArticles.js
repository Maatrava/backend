import mongoose from "mongoose";
import dotenv from "dotenv";
import Article from "./models/Article.js";

dotenv.config();

const articles = [
    {
        title: "Postpartum Care for New Mothers",
        content: "Recovery after childbirth is a gradual process. Focus on rest, hydration, and nutrition. Don't hesitate to ask for help with household chores.",
        category: "Recovery",
        author: "Dr. Sarah Miller",
    },
    {
        title: "The Importance of Exclusive Breastfeeding",
        content: "Breast milk provides all the nutrients a baby needs for the first six months. It also contains antibodies that protect against common childhood illnesses.",
        category: "Feeding",
        author: "Jane Doe, IBCLC",
    },
    {
        title: "Signs of Postpartum Depression",
        content: "It's normal to feel 'baby blues', but if feelings of sadness or anxiety persist for more than two weeks, consult your healthcare provider.",
        category: "Mental Health",
        author: "Clinical Psychologist Mark Smith",
    },
    {
        title: "Newborn Sleep Patterns",
        content: "Newborns typically sleep 14-17 hours a day in short bursts. Establishing a gentle routine can help both you and your baby transition to longer sleep periods.",
        category: "Baby Care",
        author: "Sleep Specialist Leo Grant",
    }
];

const seedArticles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        await Article.deleteMany({}); // Optional: clear existing
        await Article.insertMany(articles);

        console.log("Articles seeded successfully!");
        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedArticles();
