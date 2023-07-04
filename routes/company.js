const express = require("express");
const router = express.Router();
const config = require("../config/config");
const Company = require("../models/company");
const { google } = require('googleapis');
const authMiddleware = require("../middleware/authMiddleware");

router.get("/get-companies",authMiddleware ,async (req, res, next) => {
  
  if (req.userRole !== "admin") {
    return res.status(401).json({ message: "Unauthorized only an admin can get all the companies" });
  }
  
  try {
    const users = await Company.find({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// GET /company/:id/stats
router.get("/company/:id/stats", authMiddleware ,async (req, res, next) => {
  
  if (req.userRole !== "admin") {
    return res.status(401).json({ message: "Unauthorized only an admin can get the stats of a company" });
  }
  
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


router.get("/company/:id/stats", authMiddleware ,async (req, res, next) => {
  
  if (req.userRole !== "admin") {
    return res.status(401).json({ message: "Unauthorized only an admin can get the stats of a company" });
  }
  
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

    // delete service account
    deleteServiceAccount(config.projectID, company.serviceAccountID);
    
    // Delete the company
    await Company.findByIdAndRemove(companyId);


    
    res.json({ message: "Company account and service account deleted successfully" });
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

router.patch("/update-gmail/:id", authMiddleware, async (req, res) => {


  try {
    if (req.userRole == "admin") {
    
        const companyID = req.params.id;
        await Company.findByIdAndUpdate(companyID, { sharingGmail: req.body.sharingGmail });
        return res.status(200).json({ message: "the gmail account has been changed" });
  
    }
    else {

      return res.status(401).json({ message: "Unauthorized only a admin account" });
    }


  }
  catch (err) {
    res.json({ err:err.message })
  }
})


const auth = new google.auth.GoogleAuth({
  keyFile: config.credentialFile,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

async function deleteServiceAccount(projectId, serviceAccountId) {
  try {
    const iam = google.iam({
      version: 'v1',
      auth,
    });

    const name = `projects/${projectId}/serviceAccounts/${serviceAccountId}`;

    // Delete the service account
    await iam.projects.serviceAccounts.delete({
      name,
    });

    console.log(`Service account ${name} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting service account:', error);
  }
}




module.exports = router;


