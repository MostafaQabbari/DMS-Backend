
const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const dateNow = require("../global/dateNow")

const statisticFunctions = require("../global/statisticsFunctions");
const Company = require("../models/company");

// const validationMail = function (x) {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (emailRegex.test(x)) {
//         return true
//     } else {
//         return false
//     }
// }

router.patch("/addC2MIAM2/:id", async (req, res) => {

    try {

        let MIAM2mediator = req.body;
        let MIAM_C2_Date = MIAM2mediator.mediationDetails.DateOfMIAM
        let caseSuitable = MIAM2mediator.FinalComments.isSuitable;   // Yes or No

        if (caseSuitable == "Yes") {

            let MajorDataC2 = {
                fName: req.body.mediationDetails.clientFirstName,
                sName: req.body.mediationDetails.clientSurName,
                mail: req.body.mediationDetails.clientEmail,
            }
            let MajorDataC1sName = req.body.mediationDetails.otherPartySurname;

            let currentCase = await Case.findById(req.params.id);

            let Reference = `${MajorDataC1sName} & ${MajorDataC2.sName}`;
            let statusRemider = {
                reminderID: `${currentCase._id}-statusRemider`,
                reminderTitle: `${currentCase.Reference}-MIAM Part 2-C2`,
                startDate: dateNow()
            }

            const stringfyMIAM2Data = JSON.stringify(MIAM2mediator)
            //!currentCase.MIAM2AddedData
            if (true) {

                const updateCase = await Case.findByIdAndUpdate(req.params.id, {
                    $set: {
                        'MajorDataC2.fName': MajorDataC2.fName,
                        'MajorDataC2.sName': MajorDataC2.sName,
                        'MajorDataC2.mail': MajorDataC2.mail,
                        'MajorDataC1.sName': MajorDataC1sName,
                        'Reminders.statusRemider': statusRemider,
                        'MIAMDates.MIAM_C2_Date': MIAM_C2_Date,
                    }, MIAM2C2: stringfyMIAM2Data, MIAM2C2AddedData: true, status: "MIAM Part 2-C2", Reference
                })
                const miam1c1 = JSON.parse(updateCase.client1data)
                const miam1c2 = JSON.parse(updateCase.client2data)
                //miam2c2, currentCase, miam1c2, miam1c1
                let MIAM2_Statistics_C2 = statisticFunctions.MIAM2_Statistics_C2(MIAM2mediator, updateCase, miam1c2, miam1c1);
                const targetComp = await Case.findById(req.params.id).populate('connectionData.companyID');
                const targetCompID = targetComp.connectionData.companyID._id;
                const stringfyStatiscs = JSON.stringify(MIAM2_Statistics_C2)
                await Company.findByIdAndUpdate(targetCompID, {
                    $push: { statistics: stringfyStatiscs }
                })

                res.status(200).json({ "message": " MIAM2 has been added " })
            }


        }
        if (caseSuitable == "No") {

            let MajorDataC2 = {
                fName: req.body.mediationDetails.clientFirstName,
                sName: req.body.mediationDetails.clientSurName,
                mail: req.body.mediationDetails.clientEmail,
            }

            let MajorDataC1sName = req.body.mediationDetails.otherPartySurname;

            const stringfyMIAM2Data = JSON.stringify(MIAM2mediator)
            //!currentCase.MIAM2AddedData
            if (true) {

                const updateCase = await Case.findByIdAndUpdate(req.params.id, {
                    $set: {
                        'MajorDataC2.fName': MajorDataC2.fName,
                        'MajorDataC2.sName': MajorDataC2.sName,
                        'MajorDataC2.mail': MajorDataC2.mail,
                        'MajorDataC1.sName': MajorDataC1sName,
                    }, MIAM2C2: stringfyMIAM2Data,
                    MIAM2C2AddedData: true,
                    status: "Not suitable for mediation", Reference, closed: true
                })

                const miam1c1 = JSON.parse(updateCase.client1data)
                const miam1c2 = JSON.parse(updateCase.client2data)
                //miam2c2, currentCase, miam1c2, miam1c1
                let MIAM2_Statistics_C2 = statisticFunctions.MIAM2_Statistics_C2(MIAM2mediator, updateCase, miam1c2, miam1c1);
                const targetComp = await Case.findById(req.params.id).populate('connectionData.companyID');
                const targetCompID = targetComp.connectionData.companyID._id;
                const stringfyStatiscs = JSON.stringify(MIAM2_Statistics_C2)
                await Company.findByIdAndUpdate(targetCompID, {
                    $push: { statistics: stringfyStatiscs }
                })
                res.status(200).json({ "message": " MIAM2 has been added with Not Suitable status " })
            }


        }






    }
    catch (Err) {
        res.status(400).json({ "err": Err.message })
    }

});









module.exports = router;
