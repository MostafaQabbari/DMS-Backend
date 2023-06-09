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

// GET /company/:id/stats
router.get("/company/:id/stats", async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the company by ID
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Get the number of mediators and cases associated with the company
    const mediatorCount = company.mediators.length;
    const caseCount = company.cases.length;
    const companyName = company.companyName

 
    res.json({
      mediatorCount,
      caseCount,
      companyName,
    });
  } catch (error) {
    console.error("Error retrieving company stats:", error);
    next(error);
  }
});



// DELETE /companies/:id
router.delete("/company/:id", authMiddleware , async (req, res, next) => {
  
  if (req.userRole !== "admin") {
    return res.status(401).json({ message: "Unauthorized only an admin  can delete a company account " });
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

// PATCH /companies/:id
router.patch("/update-company/:id", authMiddleware , async (req, res, next) => {
  
  if (req.userRole !== "admin") {
    return res.status(401).json({ message: "Unauthorized only an admin  can update a company account " });
  }
  
  
  try {
    const companyId = req.params.id;
    const updateData = req.body;

    // Check if the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Update the company data
    const updatedCompany = await Company.findByIdAndUpdate(companyId, updateData, { new: true });

    res.json({ company: updatedCompany });
  } catch (error) {
    next(error);
  }
});





module.exports = router;


