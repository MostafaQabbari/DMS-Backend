const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const mediator = require('../models/mediator');
const Company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");


// router.patch("/mediationForm/:id", async (req, res) => {


//     /*{
//            caseDetails.C2mail,
//            caseDetails.C2name
//            caseDetails.C1name
 
//             mediationDetails.companyName
//             mediationDetails.medName
 
//             messageInfo.formUrl
//     }
//     */

//     try {

//         let MIAM2mediator = req.body;
//         let MIAM_C1_Date = MIAM2mediator.mediationDetails.DateOfMIAM
//         let caseSuitable = MIAM2mediator.FinalComments.isSuitable;   // Yes or No

//         if (caseSuitable == "Yes") {
//             let caseDetails = {}, mediationDetails = {}, messageInfo = {};
//             let MajorDataC1 = {
//                 fName: req.body.mediationDetails.clientFirstName,
//                 sName: req.body.mediationDetails.clientSurName,
//                 mail: req.body.mediationDetails.clientEmail,
//             }



//             let MajorDataC2sName = req.body.mediationDetails.otherPartySurname;

//             let currentCase = await Case.findById(req.params.id);

//             let Reference = `${req.body.mediationDetails.clientSurName} & ${currentCase.MajorDataC2.sName}`;
//             let statusRemider = {
//                 reminderID: `${currentCase._id}-statusRemider`,
//                 reminderTitle: `${currentCase.Reference}-MIAM Part 2-C1`,
//                 startDate: dateNow()
//             }
  

//             caseDetails.C2mail = currentCase.MajorDataC2.mail
//             caseDetails.C2name = `${currentCase.MajorDataC2.fName} ${currentCase.MajorDataC2.sName}`
//             caseDetails.C1name = `${currentCase.MajorDataC1.fName} ${currentCase.MajorDataC1.sName}`
//             const companyData = await Case.findById(req.params.id).populate('connectionData.companyID');
//             mediationDetails.companyName = companyData.connectionData.companyID.companyName;
//             const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
//             mediationDetails.medName = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;
//             messageInfo.formUrl = `${config.baseUrlC2Invitation}/${config.C2_Invitaion}/${req.params.id}`;
//             const stringfyMIAM2Data = JSON.stringify(MIAM2mediator)
//             //!currentCase.MIAM2AddedData
//             if (!currentCase.MIAM2AddedData) {

//                 await Case.findByIdAndUpdate(req.params.id, {
//                     $set: {
//                         'MajorDataC1.fName': MajorDataC1.fName,
//                         'MajorDataC1.sName': MajorDataC1.sName,
//                         'MajorDataC1.mail': MajorDataC1.mail,
//                         'MajorDataC2.sName': MajorDataC2sName,
//                         'Reminders.statusRemider': statusRemider,
//                         'MIAMDates.MIAM_C1_Date': MIAM_C1_Date, 

//                     }, MIAM2mediator: stringfyMIAM2Data, MIAM2AddedData: true, status: "MIAM Part 2-C1" ,Reference
                  
//                 })
//                 if (validationMail(caseDetails.C2mail)) {

//                     sendMailC2Invitation(caseDetails, mediationDetails, messageInfo)
//                 }
//                 else {
//                     res.status(400).json({ "message": "Client 2 did not add valid email to recieve the invitation " })
//                 }

//                 res.status(200).json({ "message": " MIAM2 has been added and Inviation sent to C2" })
//             }
//             else {
//                 res.status(400).json({ "message": "this MIAM2 has been added before" })
//             }

//         } else {

//             let MajorDataC1 = {
//                 fName: req.body.mediationDetails.clientFirstName,
//                 sName: req.body.mediationDetails.clientSurName,
//                 mail: req.body.mediationDetails.clientEmail,
//             }

//             let MajorDataC2sName = req.body.mediationDetails.otherPartySurname;

//             const stringfyMIAM2Data = JSON.stringify(MIAM2mediator)
//             //!currentCase.MIAM2AddedData
//             if (!currentCase.MIAM2AddedData) {

//                 await Case.findByIdAndUpdate(req.params.id, {
//                     $set: {
//                         'MajorDataC1.fName': MajorDataC1.fName,
//                         'MajorDataC1.sName': MajorDataC1.sName,
//                         'MajorDataC1.mail': MajorDataC1.mail,
//                         'MajorDataC2.sName': MajorDataC2sName
//                     }, MIAM2mediator: stringfyMIAM2Data,
//                     MIAM2AddedData: true,
//                     status: "Not suitable for mediation"
//                 })
//                 res.status(200).json({ "message": " MIAM2 has been added with Not Suitable status " })
//             }
//             else {
//                 res.status(400).json({ "message": "this MIAM2 has been added before" })
//             }

//         }






//     }
//     catch (Err) {
//         res.status(400).json({ "err": Err.message })
//     }

// });



module.exports=router