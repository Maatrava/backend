const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    url: { type: String, default: "" },
}, { timestamps: true });

const Article = mongoose.model("Article", articleSchema);

const sampleArticles = [
    {
        title: "Signs of Postpartum Depression",
        content: "It's normal to feel 'baby blues', but if feelings of sadness or anxiety persist for more than two weeks, you might be experiencing postpartum depression.",
        category: "Mental Health",
        author: "Dr. Sarah Johnson",
        url: "https://www.mayoclinic.org/diseases-conditions/postpartum-depression/symptoms-causes/syc-20376617"
    },
    {
        title: "Newborn Sleep Patterns",
        content: "Newborns typically sleep 14-17 hours a day in short bursts. Establishing a gentle routine can help both you and your baby get better rest.",
        category: "Baby Care",
        author: "Nurse Karen Smith",
        url: "https://www.sleepfoundation.org/baby-sleep/newborn-sleep-patterns"
    },
    {
        title: "The Importance of Exclusive Breastfeeding",
        content: "Breast milk provides all the nutrients a baby needs for the first six months. It also contains antibodies that help your baby fight off viruses and bacteria.",
        category: "Feeding",
        author: "Nutritionist Priya Rai",
        url: "https://www.who.int/health-topics/breastfeeding"
    },
    {
        title: "Postpartum Care for New Mothers",
        content: "Recovery after childbirth is a gradual process. Focus on rest, hydration, and nutrition. Don't be afraid to ask for help with household tasks.",
        category: "Recovery",
        author: "Dr. Anita Desai",
        url: "https://www.acog.org/womens-health/faqs/postpartum-care"
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Remove old articles to avoid duplicates during testing if desired, 
        // or just update them. Let's clear and re-add for a clean demo.
        await Article.deleteMany({});
        console.log("Cleared existing articles.");

        await Article.insertMany(sampleArticles);
        console.log("Sample articles with URLs inserted successfully!");

        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seed();
