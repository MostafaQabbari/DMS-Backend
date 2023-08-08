const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");
const nodemailer = require("nodemailer")
const decryptTwillioData = require('../middleware/getDataFromTwilio');
const config = require("../config/config");
const dateNow = require("../global/dateNow");



router.post("/MIAM1_Meeting_C1/:id", async (req, res) => {


    try {

        let currentCase = await Case.findById(req.params.id);
        let lowIncome_C2 = req.body
        const StringfyData = JSON.stringify(lowIncome_C2);

        if (!currentCase.lowIncome_C2) {

            await Case.findByIdAndUpdate(req.params.id, {
                lowIncome_C2: StringfyData
            })

            let companyData={} , clientData={},messageBodyinfo={}
   
            const currentComp = await Case.findById(currentCase._id).populate('connectionData.companyID');
             companyData.email = currentComp.connectionData.companyID.email;
             companyData.companyName = currentComp.connectionData.companyID.companyName;


            const updatedCase = await Case.findById(req.params.id);
            clientData.clientName = `${updatedCase.MajorDataC2.fName} ${updatedCase.MajorDataC2.sName}`
            clientData.email = updatedCase.MajorDataC2.mail

            messageBodyinfo.formType = "MIAM 1"
            messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/${req.params.id}`;
            sendMailMIAM1(companyData, clientData, messageBodyinfo);
            notifyCompany(companyData.email, clientData.clientName)

            res.json({ "message": "Low income form for C2 has been added" })

        }
        else {
            res.json({ "message": "this from has been applied before" })

        }
    } catch (err) {
        res.json(err.message)
    }


});





module.exports = router
