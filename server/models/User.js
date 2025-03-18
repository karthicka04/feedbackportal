import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  isAdmin: { type: Boolean, default: false },
  likedFeedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feedback" }],
  savedFeedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feedback" }],
});

const User = mongoose.model("User", userSchema);
export default User;
