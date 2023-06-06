const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Company = require("../models/company");
const Mediator = require("../models/mediator");
const Admin = require("../models/admin");


const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    let user = await Company.findById(decoded.id);
    if (!user) {
      user = await Mediator.findById(decoded.id);
      if (!user) {
        user = await Admin.findById(decoded.id);
        if(!user){
        return res.status(401).json({ message: "Invalid token" });
        }}
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (decoded.type === "access") {
      req.user = user;
      req.userRole = decoded.role; // add role to request object
      next();
    } else if (decoded.type === "refresh") {
      
      return res.status(200).json({ message: "this is a refresh token" });
      // if (user.role === "company") {
      //   const refreshToken = await Company.findone({ refreshToken });
      // } else if (user.role === "mediator") {
      //   const refreshToken = await Mediator.findone({ refreshToken });
      // }

      // if (!refreshToken) {
      //   return res.status(401).json({ message: "Invalid token" });
      // }
      
      // const accessToken = generateAccessToken(user);
      // res.setHeader("Authorization", `Bearer ${accessToken}`);
      // req.user = user;
      // req.userRole = decoded.role; // add role to request object
      // next();
    } else {
      return res.status(401).json({ message: "Invalid token type" });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// const getUserFromToken = async (decodedToken) => {
//   if (decodedToken.role === "company") {
//     const user = await Company.findById(decodedToken.id);
//     return user;
//   } else if (decodedToken.role === "mediator") {
//     const user = await Mediator.findById(decodedToken.id);
//     return user;
//   } else {
//     return null;
//   }
// };

// const generateAccessToken = (user) => {
//   const accessToken = jwt.sign({ id: user._id, role: user.role, type: "access" }, config.jwtSecret, { expiresIn: "1h" });
//   return accessToken;
// };

module.exports = authMiddleware;



// const jwt = require("jsonwebtoken");
// const config = require("../config/config");
// const Company = require("../models/company");
// const Mediator = require("../models/mediator");

// const authMiddleware = async (req, res, next) =>  {
//   try {
//     const authHeader = req.headers.authorization;
    
//     if (!authHeader) {
//       return res.status(401).json({ message: "Authorization header missing" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, config.jwtSecret);

//     let user;
//     if (decoded.role === "company") {
//       user = await Company.findById(decoded.id);
//     } else if (decoded.role === "mediator") {
//       user = await Mediator.findById(decoded.id);
//     }

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user;
//     req.userRole = decoded.role; // add role to request object
//     next();
//   } catch (error) {
//     console.error(error);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// module.exports = authMiddleware;


