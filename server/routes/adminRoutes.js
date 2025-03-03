import express from "express";

import User from "../models/User.js";

const router = express.Router();

router.post("/add-user", async (req, res) => {
    const { name, email, password } = req.body;

    try {
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        console.log("Received password:", password);

        
        const newUser = new User({
            name,
            email,
            password,
        });

        await newUser.save();
        res.status(201).json({ message: "User added successfully" });

    } catch (error) {
        console.error("Error adding user:", error); 
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;