import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    feedbackId: { type: mongoose.Schema.Types.ObjectId, ref: "Feedback", required: true },
}, { timestamps: true });

const Bookmark = mongoose.model("Bookmark", BookmarkSchema);
export default Bookmark;