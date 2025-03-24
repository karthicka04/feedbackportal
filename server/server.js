import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/adminRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import viewFeedbackRoutes from "./routes/viewFeedback.js";
import RecruitersRoutes from "./routes/RecruitersRoutes.js";
import attendeeRoutes from "./routes/attendees.js";



dotenv.config();


const app = express();


connectDB();


app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Adjust if needed
app.use(express.json());
app.use(bodyParser.json());


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/viewFeedback", viewFeedbackRoutes);
app.use('/api/recruiters', RecruitersRoutes);
app.use('/api/attendees',attendeeRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
