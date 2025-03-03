import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Stored in plain text (⚠️ Not Secure)
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema); // ✅ Model name should be singular: "User"
export default User;
