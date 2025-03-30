import express from "express";
import Feedback from "../models/feedback.js"; 
import User from "../models/User.js";
import Bookmark from "../models/Bookmark.js";
import Liked from "../models/Liked.js";
import Flaged from "../models/Flaged.js";
const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const { companyId } = req.query;
        if (!companyId) return res.status(400).json({ message: "Company ID is required" });
        const feedbacks = await Feedback.find({ companyId }).populate('savedBy');
        if (!feedbacks.length) return res.status(404).json({ message: "No feedback found" });

        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get("/bookmark/:userId", async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ userId: req.params.userId }).populate({
            path: "feedbackId",
            populate: {
                path: 'userId',

            }
        });const savedFeedbacks = bookmarks.map((bookmark) => bookmark.feedbackId);
        res.json(savedFeedbacks);
    } catch (error) {
        console.error("Error fetching saved feedbacks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/bookmark", async (req, res) => {
    console.log('Bookmark Route Hit!');
    try {
        const { userId, feedbackId } = req.body;
        console.log('Received Bookmark Data:', req.body);
        console.log('User ID Type:', typeof req.body.userId);
        console.log('Feedback ID Type:', typeof req.body.feedbackId);
        if (!userId || !feedbackId) {
            return res.status(400).json({ message: "User ID and Feedback ID are required" });
        }
        const existingBookmark = await Bookmark.findOne({ userId, feedbackId });
        console.log("Existing Bookmark:", existingBookmark);
        if (existingBookmark) { 
            await Bookmark.deleteOne({ _id: existingBookmark._id });
            const feedback = await Feedback.findByIdAndUpdate(
                feedbackId,
                { $pull: { savedBy: userId } },
                { new: true }
            );
            return res.status(200).json({ message: "Feedback unbookmarked successfully" });
        } else {
           const newBookmark = new Bookmark({ userId, feedbackId });
            await newBookmark.save();
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

router.get("/flag", async (req, res) => {
    console.log('flag Route Hit!');
    try {
        const userId = req.query.userId;
        const feedbackId = req.query.feedbackId; 
        let query = {};

        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                 return res.status(400).json({ error: 'Invalid userId: Not a valid ObjectId.' });
            }
            query.userId = userId;
        }
        if (feedbackId) {
             if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
                 return res.status(400).json({ error: 'Invalid feedbackId: Not a valid ObjectId.' });
            }
            query.feedbackId = feedbackId; 
        }

        const allFlaged = await Flaged.find(query).populate({
            path: "userId",
            populate: {
                path: "feedbackId",

            }
        });
      
        res.status(200).json(allFlaged);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Failed to fetch feedback.', details: error.message, stack: error.stack });
    }
});

router.post("/flag", async (req, res) => {
    try {
        const { userId, feedbackId } = req.body;
        if (!userId || !feedbackId) {
            return res.status(400).json({ message: "User ID and Feedback ID are required" });
        }const existingFlag = await Flaged.findOne({ userId, feedbackId });
        if (existingFlag) {
           
            await Flaged.deleteOne({ _id: existingFlag._id });
           
            const feedback = await Feedback.findByIdAndUpdate(
                feedbackId,
                { $pull: { flagedBy: userId } },
                { new: true }
            );
            return res.status(200).json({ message: "Feedback unflaged successfully" });
        } else {
            const newFlag = new Flaged({ userId, feedbackId }); 
            await newFlag.save();
            const feedback = await Feedback.findByIdAndUpdate(
                feedbackId,
                { $push: { flagedBy: userId } },
                { new: true }
            );return res.status(201).json({ message: "Feedback flagged successfully" });
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
      }const feedback = await Feedback.findById(feedbackId);
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      const alreadyLiked = feedback.likes.includes(userId);
      if (alreadyLiked) {
         feedback.likes = feedback.likes.filter((id) => id !== userId);
      } else {

        feedback.likes.push(userId);
      }await feedback.save();
         return res.status(200).json({ message: "Feedback like toggled successfully" });
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ message: "Error toggling like" });
    }
});
export default router;