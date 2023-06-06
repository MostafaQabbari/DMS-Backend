const express = require("express");
const router = express.Router();
const Company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/get-companies",authMiddleware ,async (req, res, next) => {
  
  if (req.userRole !== "admin") {
    return res.status(401).json({ message: "Unauthorized only a admin account can get all the companies" });
  }
  
  try {
    const users = await Company.find({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});


// DELETE /companies/:id
router.delete("/company/:id", authMiddleware , async (req, res, next) => {
  
  if (req.userRole !== "admin") {
    return res.status(401).json({ message: "Unauthorized only a admin account can delete a company account " });
  }
  
  
  try {
    const companyId = req.params.id;
    
    // Check if the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    // Delete the company
    await Company.findByIdAndRemove(companyId);
    
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;


