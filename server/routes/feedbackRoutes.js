// server/routes/feedbackRoutes.js
import express from 'express';
const router = express.Router();
import Feedback from '../models/feedback.js';
import User from '../models/User.js';


const validateUserId = async (req, res, next) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'Invalid userId: User not found.' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Error validating userId:', err);
    return res.status(500).json({ error: 'Error validating user.', details: err.message });
  }
};


router.post('/', validateUserId, async (req, res) => {
  try {
    const {
      name,
      rollNumber,
      department,
      companyName,
      companyLocation,
      role,
      placementType,
      totalRounds,
      rounds,
      additionalDetails,
      tips,
      month,
      year,
      preparationTime,
      skillsUsed,
      privacyAgreement,
    } = req.body;



    const newFeedback = new Feedback({
      userId: req.user._id,
      name,
      rollNumber,
      department,
      companyName,
      companyLocation,
      role,
      placementType,
      totalRounds,
      rounds,
      additionalDetails,
      tips,
      month,
      year,
      preparationTime,
      skillsUsed,
      privacyAgreement,
    });

    const savedFeedback = await newFeedback.save();

    console.log('Feedback saved successfully:', savedFeedback);
    res.status(201).json({ message: 'Feedback submitted successfully!', feedbackId: savedFeedback._id });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Failed to save feedback.', details: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    let query = {}; // Initialize an empty query
    if (userId) {
      query = { userId: userId }; // Filter by userId if provided
    }
    const allFeedback = await Feedback.find(query).populate('userId', 'username email');
    res.status(200).json(allFeedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback.', details: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try{
    const feedbackId=req.params.id;
    const feedback = await Feedback.findById(feedbackId);
    if(!feedback)
    {
      return res.status(404).json({error:"Feedback not found"});
    }
    res.status(200).json(feedback);
  }catch(error)
  {
    console.log("error getting feedback:", error);
    res.status(500).json({ error: 'Failed to fetch feedback.', details: error.message });
  }
})



router.put('/:id', async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const {
            name,
            rollNumber,
            department,
            companyName,
            companyLocation,
            role,
            placementType,
            totalRounds,
            rounds,
            additionalDetails,
            tips,
            month,
            year,
            preparationTime,
            skillsUsed,
            privacyAgreement,
        } = req.body;

        // Find the feedback by ID and update it
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            {
                name,
                rollNumber,
                department,
                companyName,
                companyLocation,
                role,
                placementType,
                totalRounds,
                rounds,
                additionalDetails,
                tips,
                month,
                year,
                preparationTime,
                skillsUsed,
                privacyAgreement,
            },
            { new: true, runValidators: true } //  `new: true` to return the updated document and `runValidators: true` to ensure validation during the update.
        );

        if (!updatedFeedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        console.log('Feedback updated successfully:', updatedFeedback);
        res.status(200).json({ message: 'Feedback updated successfully!', feedback: updatedFeedback });

    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ error: 'Failed to update feedback.', details: error.message });
    }
});


export default router;