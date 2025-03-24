import express from "express";
import Feedback from "../models/feedback.js"; // Ensure this model exists
import User from "../models/User.js";
import Bookmark from "../models/Bookmark.js";
import Liked from "../models/Liked.js";
import Flaged from "../models/Flaged.js";

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const { companyId } = req.query;
        if (!companyId) return res.status(400).json({ message: "Company ID is required" });

        const feedbacks = await Feedback.find({ companyId }).populate('likes').populate('savedBy');
        if (!feedbacks.length) return res.status(404).json({ message: "No feedback found" });

        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 📍 Bookmark a feedback
router.post("/bookmark", async (req, res) => {
    try {
        const { userId, feedbackId } = req.body;

        if (!userId || !feedbackId) {
            return res.status(400).json({ message: "User ID and Feedback ID are required" });
        }

        // Check if the bookmark already exists
        const existingBookmark = await Bookmark.findOne({ userId, feedbackId });

        if (existingBookmark) {
            // If it exists, remove the bookmark
            await Bookmark.deleteOne({ _id: existingBookmark._id });
             // Remove feedbackId from user's savedBy array
            const feedback = await Feedback.findByIdAndUpdate(
                feedbackId,
                { $pull: { savedBy: userId } },
                { new: true }
            );
            return res.status(200).json({ message: "Feedback unbookmarked successfully" });
        } else {
            // If it doesn't exist, create a new bookmark
            const newBookmark = new Bookmark({ userId, feedbackId });
            await newBookmark.save();
              // Add feedbackId to user's savedBy array
            const feedback = await Feedback.findByIdAndUpdate(
                feedbackId,
                { $push: { savedBy: userId } },
                { new: true }
            );


            return res.status(201).json({ message: "Feedback bookmarked successfully" });
        }
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        res.status(500).json({ message: "Error toggling bookmark" });
    }
});
router.post("/flag", async (req, res) => {
    try {
        const { userId, feedbackId } = req.body;

        if (!userId || !feedbackId) {
            return res.status(400).json({ message: "User ID and Feedback ID are required" });
        }

        // Check if the bookmark already exists
        const existingFlag = await Flaged.findOne({ userId, feedbackId });

        if (existingFlag) {
            // If it exists, remove the bookmark
            await Flaged.deleteOne({ _id: existingFlag._id });
             // Remove feedbackId from user's savedBy array
            const feedback = await Feedback.findByIdAndUpdate(
                feedbackId,
                { $pull: { flagedBy: userId } },
                { new: true }
            );
            return res.status(200).json({ message: "Feedback unflaged successfully" });
        } else {
            // If it doesn't exist, create a new bookmark
            const newFlag = new Flaged({ userId, feedbackId });  // Corrected here
            await newFlag.save();
              // Add feedbackId to user's savedBy array
            const feedback = await Feedback.findByIdAndUpdate(
                feedbackId,
                { $push: { flagedBy: userId } },
                { new: true }
            );


            return res.status(201).json({ message: "Feedback flagged successfully" });
        }
    } catch (error) {
        console.error("Error toggling flag:", error);
        res.status(500).json({ message: "Error toggling flag" });
    }
});
router.post("/like", async (req, res) => {
    try {
      const { userId, feedbackId } = req.body;
  
      if (!userId || !feedbackId) {
        return res
          .status(400)
          .json({ message: "User ID and Feedback ID are required" });
      }
  
      const feedback = await Feedback.findById(feedbackId);
  
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
  
      const alreadyLiked = feedback.likes.includes(userId);
  
      if (alreadyLiked) {
        // Unlike: Remove the userId from the likes array
        feedback.likes = feedback.likes.filter((id) => id !== userId);
      } else {
        // Like: Add the userId to the likes array
        feedback.likes.push(userId);
      }
  
      await feedback.save();
  
      return res.status(200).json({ message: "Feedback like toggled successfully" });
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ message: "Error toggling like" });
    }
  });
  
  
// 📍 Like a feedback


export default router;