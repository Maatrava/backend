import mongoose from "mongoose";

const userPreferenceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    theme: { type: String, default: "light" },
    notificationSettings: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
    },
    interests: { type: [String], default: [] },
}, { timestamps: true });

const UserPreference = mongoose.model("UserPreference", userPreferenceSchema);
export default UserPreference;
