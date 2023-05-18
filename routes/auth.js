const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require("path");
const config = require("../config/config");
const Company = require("../models/company");
const Mediator = require('../models/mediator');
const authMiddleware = require("../middleware/authMiddleware");
// const { appendFile } = require("fs");
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

router.post("/company-signup", (req, res, next) => {
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

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

      // Check if the password meets the minimum requirements
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one letter and one number" });
      }


      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new Company({
        companyName,
        email,
        password: hashedPassword,
        companyLogo: req.file ? req.file.filename : null,
      });

      await user.save();

      const  accessToken = jwt.sign({ id: user._id, role: "company", type:'access' }, config.jwtSecret, { expiresIn: "15m" });
      const refreshToken = jwt.sign({ id: user._id, role: "company", type:'refresh' }, config.jwtSecret, { expiresIn: '7d' });
      // Store refresh token in database
       await Company.findByIdAndUpdate(user._id, { refreshToken });

      res.status(201).json({  accessToken , refreshToken });
    } catch (error) {
      next(error);
    }
  });
});



router.post("/company-login", async (req, res, next) => {
  
  try {
    const { email, password } = req.body;

    const user = await Company.findOne({email});
   
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);

    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid  password" });
    }
    
    
    const  accessToken = jwt.sign({ id: user._id, role: "company", type:'access' }, config.jwtSecret, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id, role: "company", type:'refresh' }, config.jwtSecret, { expiresIn: '7d' });
    
    // Store refresh token in database
    await Company.findByIdAndUpdate(user._id, { refreshToken });

    res.status(201).json({  accessToken , refreshToken });
  } catch (error) {
    next(error);
  }
});



router.post("/mediator-login", async (req, res, next) => {
  
  try {
    const { email, password } = req.body;

    const user = await Mediator.findOne({email});
   
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);

    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid  password" });
    }
    
    
    const  accessToken = jwt.sign({ id: user._id, role: "mediator", type: 'access' }, config.jwtSecret, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id, role: "mediator" , type:'refresh' }, config.jwtSecret, { expiresIn: '7d' });
    // Store refresh token in database
    await Mediator.findByIdAndUpdate(user._id, { refreshToken });

    res.status(201).json({  accessToken , refreshToken });
  } catch (error) {
    next(error);
  }
});



router.get("/user-info", authMiddleware, (req, res, next) => {

  res.status(200).json({ user: req.user, role: req.userRole});
 
});





// Mediator form submission route
router.post('/add-mediator', authMiddleware, async (req, res, next) => {

  if (req.userRole !== "company") {
    return res.status(401).json({ message: "Unauthorized only a company account can add Mediator" });
  }
  
  try {
    
    const { firstName, lastName, email, password, phoneNumber } = req.body;


    const existingUser = await Mediator.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Mediator already exists" });
    }


    // Validate input fields
    if (!firstName || !lastName || !email || !password || !phoneNumber ) {
      return res.status(400).json({ message: 'All fields are required!' });
    }
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Check if the password meets the minimum requirements
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one letter and one number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const mediator = new Mediator({ firstName, lastName, email, password: hashedPassword, phoneNumber, companyId: req.user._id});
    
    await mediator.save();
    
    const companyId = req.user._id;

    // Update the company's mediators array with the new mediator ID
    await Company.findByIdAndUpdate(companyId, { $push: { mediators: mediator._id } });
    

    res.status(201).json({ message: 'Mediator added successfully!' });
  } catch (error) {
    next(error);
  }



});


router.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, config.jwtSecret);

    let user = await Company.findById(decoded.id);
    if (!user) {
      user = await Mediator.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const accessToken = jwt.sign({ id: user._id, role: decoded.role , type:'access'}, config.jwtSecret, { expiresIn: "1h" });

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
});



router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;

    // Generate a password reset token
    const resetTokenData = generateResetToken();

    // Find the user by email
    const user = await Company.findOne({email});
    if (!user) {
      user = await Mediator.findone({email});
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
    }


    // Save the reset token and expiry time to the company or mediator documents
    user.resetToken = resetTokenData.token;
    user.resetTokenExpiry = resetTokenData.expiresAt;
    await user.save();

    // Send the reset password email to the user (e.g., using Nodemailer)
    sendResetPasswordEmail(user.email, resetToken);

    res.status(200).json({ message: "Password reset email sent"  });
  } catch (error) {
    next(error);
  }
});



router.post("/reset-password", async (req, res, next) => {
  try {
    const { email, resetToken, newPassword } = req.body;


    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Check if the password meets the minimum requirements
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one letter and one number" });
    }

    // Find the user by email and reset token
    const user = await Company.findOne({ email, resetToken, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) {
      user = await Mediator.findOne({ email, resetToken, resetTokenExpiry: { $gt: Date.now() } });
      if (!user) {
        return res.status(401).json({ message: "Invalid reset token" });
      }
    }


    // Update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
});








// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  starttls: {
      enable: true
  },
  starttls: {
    enable: true
},

  secureConnection: false,

  auth: {
    user: config.companyEmail,
    pass: config.appPassWord,
  },

}) 




// Send the reset password email to the user
function sendResetPasswordEmail(email, resetToken) {

  const mailOptions = {
    from: config.companyEmail, // your email address
    to: "mkabary8@gmail.com", // recipient's email address
    subject: "Password Reset Request",
    text: `You have requested to reset your password. Please click the link below to reset your password:
    http://example.com/reset-password?token=${resetToken}`,
    html: `<p>You have requested to reset your password. Please click the link below to reset your password:</p>
    <a href="http://example.com/reset-password?token=${resetToken}">Reset Password</a>`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending password reset email:", error);
    } else {
      console.log("Password reset email sent:", info.response);
    }
  });
}




// Function to generate a reset token with expiry
function generateResetToken() {
  const resetToken = crypto.randomBytes(20).toString("hex"); // Generate a random token
  const expiryTime = Date.now() + 900000; // Set token expiry to 15 minutes from now

  return {
    token: resetToken,
    expiresAt: new Date(expiryTime),
  };
}




module.exports = router;