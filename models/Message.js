import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional if logged out
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;
