const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Company = require("../models/company");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await Company.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;



// const jwt = require('jsonwebtoken');
// const Company = require('../models/company');
// const Mediator = require('../models/mediator');
// const config = require('../config');

// const router = express.Router();
// const saltRounds = 10;

// // Authentication middleware
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Authentication token not found!' });
//   }

//   jwt.verify(token, config.jwt.secretKey, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid authentication token!' });
//     }

//     req.user = user;
//     next();
//   });
// }

// // Mediator form submission route
// router.post('/mediator', authenticateToken, async (req, res, next) => {
//   try {
//     const { firstName, lastName, email, password, phoneNumber, model } = req.body;

//     // Validate input fields
//     if (!firstName || !lastName || !email || !password || !phoneNumber || !model) {
//       return res.status(400).json({ message: 'All fields are required!' });
//     }

//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     const mediator = new Mediator({ firstName, lastName, email, password: hashedPassword, phoneNumber, model });
//     await mediator.save();

//     res.status(201).json({ message: 'Mediator added successfully!' });
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;