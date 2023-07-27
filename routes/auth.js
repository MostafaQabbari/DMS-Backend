const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require("path");
const config = require("../config/config");
const Admin = require("../models/admin");
const Company = require("../models/company");
const Mediator = require('../models/mediator');
const authMiddleware = require("../middleware/authMiddleware");
const CryptoJS = require("crypto-js");
const { google } = require('googleapis');

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


router.post("/add-company", authMiddleware, async (req, res, next) => {
  try {
    // Code for authorization, file upload, and data extraction
    if (req.userRole !== "admin") {
      return res.status(401).json({ message: "Unauthorized. Only an admin can create a company." });
    }
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
    
    const { companyName, email, password, logo ,sharingGmail, twillioData } = req.body;


    const existingUser = await Company.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Other validation and data processing code

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one letter and one number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let cryptedTwilioData;

      if (req.body.twillioData) {
        const x = require('twilio')(twillioData.twillioSID, twillioData.twillioToken);
        const phoneNumber = twillioData.twillioNumber;

        try {
          await x.messages.create({
            body: `Your Client ${companyName} twillio has been added`,
            from: phoneNumber,
            to: '+44 7476 544877' // Replace with actual recipient number
          });

          cryptedTwilioData = CryptoJS.AES.encrypt(JSON.stringify([twillioData]), 'ourTwillioEncyptionKey').toString();
        } catch (error) {
          console.error(error);
        }
      }

    const user = new Company({
      // Company data
      companyName,
      email,
      password: hashedPassword,
      sharingGmail:sharingGmail,
      logo: logo,
      companyLogo: req.file ? req.file.filename : null,
      twillioData:cryptedTwilioData,
      phoneNumberTwillio:req.body.twillioData.twillioNumber
    });
    // Check if sharingGmail is already present in any user within the company accounts
    const existingUser1 = await Company.findOne({ "sharingGmail": sharingGmail });
    if (existingUser1) {
      return res.status(400).json({ message: 'Sharing Gmail already exists' });
    }

      // Perform server-side validation
      const validationErrors = user.validateSync();
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors.errors).map((error) => error.message);
        return res.status(400).json({ message: 'Validation errors', errors: errorMessages });
      }

    try {
      // Save the user to the database
      await user.save();

      // Other code for creating service account, generating refresh token, and storing it
      await createServiceAccount(companyName, user._id);

      const refreshToken = jwt.sign({ id: user._id, role: "company", type: 'refresh' }, config.jwtSecret, { expiresIn: '7d' });
      await Company.findByIdAndUpdate(user._id, { refreshToken });

      // const accessToken = jwt.sign({ id: user._id, role: "company", type: 'access' }, config.jwtSecret, { expiresIn: "7d" });
      res.status(201).json({ refreshToken, message: "Company account and its service account created successfully" });
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        const duplicateField = Object.keys(error.keyValue)[0];
        const duplicateValue = error.keyValue[duplicateField];
        const errorMessage = `Duplicate entry: ${duplicateField} '${duplicateValue}' already exists.`;
        return res.status(400).json({ message: errorMessage });
      }
      next(error);
    }
  });
  } catch (error) {
    next(error);
  }
});




// router.post('/add-admin', async (req, res, next) => {

//   try {

//     const { email, password } = req.body;



//     const passwordRegex = /^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{8,}$/;

//     // Check if the password meets the minimum requirements
//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one letter and one number" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const admin = new Admin({ email, password: hashedPassword });

//     await admin.save();


//     res.status(201).json({ message: 'Admin added successfully!' });
//   } catch (error) {
//     next(error);
//   }



// });



router.post("/admin-login", async (req, res, next) => {

  try {
    const { email, password } = req.body;

    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid  password" });
    }


    const accessToken = jwt.sign({ id: user._id, role: "admin", type: 'access' }, config.jwtSecret, { expiresIn: "7d" });
    const refreshToken = jwt.sign({ id: user._id, role: "admin", type: 'refresh' }, config.jwtSecret, { expiresIn: '7d' });

    // Store refresh token in database
    await Admin.findByIdAndUpdate(user._id, { refreshToken });

    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});





router.post("/company-login", async (req, res, next) => {

  try {
    const { email, password } = req.body;

    const user = await Company.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid  password" });
    }


    const accessToken = jwt.sign({ id: user._id, role: "company", type: 'access' }, config.jwtSecret, { expiresIn: "7d" });
    const refreshToken = jwt.sign({ id: user._id, role: "company", type: 'refresh' }, config.jwtSecret, { expiresIn: '7d' });

    // Store refresh token in database
    await Company.findByIdAndUpdate(user._id, { refreshToken });

    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});



router.post("/mediator-login", async (req, res, next) => {

  try {
    const { email, password } = req.body;

    const user = await Mediator.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid  password" });
    }


    const accessToken = jwt.sign({ id: user._id, role: "mediator", type: 'access' }, config.jwtSecret, { expiresIn: "7d" });
    const refreshToken = jwt.sign({ id: user._id, role: "mediator", type: 'refresh' }, config.jwtSecret, { expiresIn: '7d' });
    // Store refresh token in database
    await Mediator.findByIdAndUpdate(user._id, { refreshToken });

    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});



router.get("/user-info", authMiddleware, (req, res, next) => {

  res.status(200).json({ user: req.user, role: req.userRole });

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
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Check if the password meets the minimum requirements
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one letter and one number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const mediator = new Mediator({ firstName, lastName, email, password: hashedPassword, phoneNumber, companyId: req.user._id });

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
        user = await Admin.findById(decoded.id);
        if (!user) {
          return res.status(401).json({ message: "Invalid token" });
        }
      }
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const accessToken = jwt.sign({ id: user._id, role: decoded.role, type: 'access' }, config.jwtSecret, { expiresIn: "7d" });

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
    let user = await Company.findOne({ email });
    if (!user) {
      user = await Mediator.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
    }


    // Save the reset token and expiry time to the company or mediator documents
    user.resetToken = resetTokenData.token;
    user.resetTokenExpiry = resetTokenData.expiresAt;
    await user.save();

    // Send the reset password email to the user (e.g., using Nodemailer)
    sendResetPasswordEmail(user.email, resetTokenData.token);

    res.status(200).json({ message: "Password reset email sent", resetTokenData });
  } catch (error) {
    next(error);
  }
});



router.post("/reset-password", async (req, res, next) => {
  try {
    const { email, resetToken, newPassword } = req.body;


    const passwordRegex = /^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{8,}$/;

    // Check if the password meets the minimum requirements
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one letter and one number" });
    }

    // Find the user by email and reset token
    let user = await Company.findOne({ email, resetToken, resetTokenExpiry: { $gt: Date.now() } });
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
    to: email, // recipient's email address
    text: `You have requested to reset your password. Please click the link below to reset your password:
    https://dms5.onrender.com/auth/reset-password?token=${resetToken}`,
    html: `<p>You have requested to reset your password. Please click the link below to reset your password:</p>
    <a href="https://dms5.onrender.com/auth/reset-password?token=${resetToken}">Reset Password</a>`,
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



async function createServiceAccount(accountName , companyID) {
  const auth = new google.auth.GoogleAuth({
    keyFile: config.credentialFile,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const iam = google.iam('v1');
  const projectId = config.projectID;

  const request = {
    name: `projects/${projectId}`,
    requestBody: {
      accountId: accountName,
      serviceAccount: {
        displayName: accountName,
      },
    },
    auth,
  };

  try {
    const response = await iam.projects.serviceAccounts.create(request);
    const { email  } = response.data;
    
   

    await Company.findByIdAndUpdate(companyID, { serviceAccount: email  });
    
    //save the service email in the company model
    await createServiceAccountKey(email , companyID);
      

    console.log(`Service Account created. Credentials saved in the database`);
  } catch (error) {
    console.error('Error creating Service Account:', error.message);
  }
}


async function createServiceAccountKey(serviceAccountEmail , companyID) {
  const auth = new google.auth.GoogleAuth({
    keyFile: config.credentialFile,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const iam = google.iam('v1');
  const projectId = 'direct-mediation-services';


  const request = {
    name: `projects/${projectId}/serviceAccounts/${serviceAccountEmail}`,
    requestBody: {
      privateKeyType: 'TYPE_GOOGLE_CREDENTIALS_FILE',
    },
    auth,
  };

  try {
    const response = await iam.projects.serviceAccounts.keys.create(request);
    const { privateKeyData } = response.data;

    const plain = Buffer.from(privateKeyData, 'base64').toString('utf8');

    
    const plainParsed = JSON.parse(plain);
    const serviceAccountId = plainParsed.client_id;
    

    await Company.findByIdAndUpdate(companyID, { serviceAccountKey: privateKeyData , serviceAccountID: serviceAccountId });



    console.log(`Key created and saved in the database.`);
  } catch (error) {
    console.error('Error creating service account key:', error.message);
  }
}




// router.post("/add-company", authMiddleware, (req, res, next) => {

//   if (req.userRole !== "admin") {
//     return res.status(401).json({ message: "Unauthorized only a admin can create a company " });
//   }


//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ message: err });
//     }

//     try {
//       const { companyName, email, password, sharingGmail ,twillioData } = req.body;
 
//       const existingUser = await Company.findOne({ email });

//       if (existingUser) {
//         return res.status(400).json({ message: "User already exists" });
//       }


//       const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

//       // Check if the password meets the minimum requirements
//       if (!passwordRegex.test(password)) {
//         return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one letter and one number" });
//       }


//       const hashedPassword = await bcrypt.hash(password, 10);
//       let cryptedTwilioData ;
     
//       if (req.body.twillioData) {
  
//         const x = require('twilio')(twillioData.twillioSID, twillioData.twillioToken);
//         const phoneNumber = twillioData.twillioNumber;
        
        
//         x.messages.create({
//           body: `Your Client ${companyName} twillio has been added   `,
//           from: phoneNumber,
//           // to here will be the Drion to send him that the company added twillio number
//           to: '+44 7476 544877'
//         }).then(()=>{
//           console.log("xxxx")
//           cryptedTwilioData =  CryptoJS.AES.encrypt(JSON.stringify([twillioData]), 'ourTwillioEncyptionKey').toString();

//         }).catch((err) => {
//           console.log(err.message)
          
//         });

//       }

    

//       try {
//         const user = new Company({
//           companyName,
//           email,
//           password: hashedPassword,
//           sharingGmail:sharingGmail,
//           companyLogo: req.file ? req.file.filename : null,
//           twillioData:cryptedTwilioData
//         });

//       // Check if sharingGmail is already present in any user within the company accounts
//       const existingUser1 = await Company.findOne({ "sharingGmail": sharingGmail });
//       if (existingUser1) {
//         return res.status(400).json({ message: 'Sharing Gmail already exists' });
//       }
      
//       // Perform server-side validation
//       const validationErrors = user.validateSync();
//       if (validationErrors) {
//         const errorMessages = Object.values(validationErrors.errors).map((error) => error.message);
//         return res.status(400).json({ message: 'Validation errors', errors: errorMessages });
//       }
  
      
//         // Save the user to the database
//         await user.save();
      
//         res.status(201).json({ message: 'User created successfully' });
//       } catch (error) {
//         if (error.code === 11000) {
//           // Duplicate key error
//           return res.status(400).json({ message: 'Duplicate entry', error });
//         }
//       }


//       await createServiceAccount(companyName , user._id);

//       // const accessToken = jwt.sign({ id: user._id, role: "company", type: 'access' }, config.jwtSecret, { expiresIn: "7d" });
//       const refreshToken = jwt.sign({ id: user._id, role: "company", type: 'refresh' }, config.jwtSecret, { expiresIn: '7d' });
//       // Store refresh token in database
//       await Company.findByIdAndUpdate(user._id, { refreshToken });

//       res.status(201).json({ refreshToken , message: "Company account and it's service account  created successfully " });
//     } catch (error) {
//       next(error);
//     }
//   });
// });

// router.post("/add-company", authMiddleware, async (req, res, next) => {
//   try {
//     if (req.userRole !== "admin") {
//       return res.status(401).json({ message: "Unauthorized. Only an admin can create a company." });
//     }

//     upload(req, res, async (err) => {
//       if (err) {
//         return res.status(400).json({ message: err });
//       }

//       const { companyName, email, password, sharingGmail, twillioData } = req.body;

//       const existingUser = await Company.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: "User already exists" });
//       }

//       const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//       if (!passwordRegex.test(password)) {
//         return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one letter and one number" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
//       let cryptedTwilioData;

//       if (req.body.twillioData) {
//         const x = require('twilio')(twillioData.twillioSID, twillioData.twillioToken);
//         const phoneNumber = twillioData.twillioNumber;

//         try {
//           await x.messages.create({
//             body: `Your Client ${companyName} twillio has been added`,
//             from: phoneNumber,
//             to: '+44 7476 544877' // Replace with actual recipient number
//           });

//           cryptedTwilioData = CryptoJS.AES.encrypt(JSON.stringify([twillioData]), 'ourTwillioEncyptionKey').toString();
//         } catch (error) {
//           console.error(error);
//         }
//       }

//       const user = new Company({
//         companyName,
//         email,
//         password: hashedPassword,
//         sharingGmail,
//         companyLogo: req.file ? req.file.filename : null,
//         twillioData: cryptedTwilioData
//       });

//       const existingUser1 = await Company.findOne({ "users.sharingGmail": sharingGmail });
//       if (existingUser1) {
//         return res.status(400).json({ message: 'Sharing Gmail already exists' });
//       }

//       const validationErrors = user.validateSync();
//       if (validationErrors) {
//         const errorMessages = Object.values(validationErrors.errors).map((error) => error.message);
//         return res.status(400).json({ message: 'Validation errors', errors: errorMessages });
//       }

//       await user.save();

//       await createServiceAccount(companyName, user._id);

//       const refreshToken = jwt.sign({ id: user._id, role: "company", type: 'refresh' }, config.jwtSecret, { expiresIn: '7d' });
//       await Company.findByIdAndUpdate(user._id, { refreshToken });

//       res.status(201).json({ refreshToken, message: "Company account and its service account created successfully" });
//     });
//   } catch (error) {
//     next(error);
//   }
// });



module.exports = router;