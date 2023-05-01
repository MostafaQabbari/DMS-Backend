const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const config = require("../config/config");
const Company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a storage engine for Multer
const storage = multer.diskStorage({
  destination: "./uploads/logos",
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Create an upload object for Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb("Error: Images only (jpeg, jpg, png)");
    }
  },
}).single("companyLogo");

router.post("/signup", (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const { companyName, email, password } = req.body;
      const existingUser = await Company.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new Company({
        companyName,
        email,
        password: hashedPassword,
        companyLogo: req.file ? req.file.filename : null,
      });

      await user.save();

      const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "1h" });

      res.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  });
});



router.post("/login", async (req, res, next) => {
  
  try {
    const { email, password } = req.body;

    const user = await Company.findOne({email});
   
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);

    
    console.log(password)
    console.log(user.password)
    

    console.log(isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid  password" });
    }
    
    

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});


router.get("/me", authMiddleware, (req, res, next) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;