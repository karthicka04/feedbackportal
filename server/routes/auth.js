import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();

router.post("/login", async (req, res) => {
    console.log("Login request received:", req.body); // Debugging

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email, password });

        if (user) {
            console.log("User found:", user);
            const temp = {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                _id: user.id,
            };
            return res.send(temp);
        } else {
            console.log("User not found!");
            return res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;
