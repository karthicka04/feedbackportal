import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", async (req, res) => {
    console.log("Login request received:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email }); // Find user by email

        if (!user) {
            console.log("User not found!");
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the entered password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            console.log("User found:", user);

            // Generate JWT token with 1-hour expiry
            const token = jwt.sign(
                {
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    registerNo:user.registerNo,
                    department:user.department,
                    batch: user.batch,
                    _id: user._id,
                },
                JWT_SECRET,  // Use your secret key from .env
                { expiresIn: "1h" } // Token expires in 1 hour
            );

            const temp = {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                registerNo:user.registerNo,
                department:user.department,
                batch: user.batch,
                _id: user._id,
                token: token  // Include the token in the response
            };
            return res.send(temp);
        } else {
            console.log("Invalid password!");
            return res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;