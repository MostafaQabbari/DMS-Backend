const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Company = require("../models/company");
const Mediator = require("../models/mediator");

const authMiddleware = async (req, res, next) =>  {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    let user;
    if (decoded.role === "company") {
      user = await Company.findById(decoded.id);
    } else if (decoded.role === "mediator") {
      user = await Mediator.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.userRole = decoded.role; // add role to request object
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;

