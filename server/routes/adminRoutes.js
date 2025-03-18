import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import XLSX from "xlsx";
import User from "../models/User.js"; 
import Company from "../models/Company.js"; 

const router = express.Router();


router.post("/add-user", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const user = new User({ name, email, password});
    await user.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/add-company", async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json({ message: "Company added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});







const upload = multer({ storage: multer.memoryStorage() });

router.post("/bulk-upload/:type", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const type = req.params.type;
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    let data = XLSX.utils.sheet_to_json(sheet);

    if (type === "user") {
      
      const usersWithHashedPasswords = await Promise.all(
        data.map(async (user) => ({
          ...user,
          password: await bcrypt.hash(user.password, 10),
        }))
      );
      await User.insertMany(usersWithHashedPasswords);
    } else if (type === "company") {
      await Company.insertMany(data);
    } else {
      return res.status(400).json({ error: "Invalid type parameter" });
    }

    res.status(200).json({ message: "Bulk upload successful" });
  } catch (err) {
    console.error("Bulk upload error:", err);
    res.status(500).json({ error: "Bulk upload failed" });
  }
});

export default router;
