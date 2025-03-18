import express from "express";
import Feedback from "../models/feedback.js"; // Ensure this model exists
import User from "../models/User.js";

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        console.log("Fetching feedback...");
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error("❌ Error fetching feedback:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/like/:userId/:feedbackId", async (req, res) => {
    try {
        const { userId, feedbackId } = req.params;

        if (!userId || userId === "null") {
            return res.status(400).json({ error: "Invalid User ID" });
        }
        if (!feedbackId) {
            return res.status(400).json({ error: "Invalid Feedback ID" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) return res.status(404).json({ error: "Feedback not found" });

        const index = user.likedFeedbacks.indexOf(feedbackId);
        if (index === -1) {
            user.likedFeedbacks.push(feedbackId);
            feedback.likes += 1;
        } else {
            user.likedFeedbacks.splice(index, 1);
            feedback.likes -= 1;
        }

        await user.save();
        await feedback.save();

        res.status(200).json({
            message: "Feedback liked/unliked successfully",
            likedFeedbacks: user.likedFeedbacks
        });
    } catch (error) {
        console.error("❌ Error in liking feedback:", error.message);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

export default router;