const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");


const config = require("../config/config");



router.patch('/updateC1M1/:id', authMiddleware, async (req, res, next) => {

    let CaseFound;


    try {

        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                let client1data = req.body
                let Reference = `${req.body.personalContactAndCaseInfo.surName} & ${req.body.otherParty.otherPartySurname}`;
                const StringfyData = JSON.stringify(client1data);
                let MajorDataC1 = {
                    fName: req.body.personalContactAndCaseInfo.firstName,
                    sName: req.body.personalContactAndCaseInfo.surName,
                    mail: req.body.personalContactAndCaseInfo.email,
                    phoneNumber: req.body.personalContactAndCaseInfo.phoneNumber
                }

                await Case.findByIdAndUpdate(req.params.id, { client1data: StringfyData, Reference, MajorDataC1 })
                // console.log(updatedCase)
                res.status(200).json({ res: "Data of MIAM1-C1 has been updated" })

            }

        }
        else if (req.userRole == 'mediator') {
            let cases = await mediator.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                let client1data = req.body
                let Reference = `${req.body.personalContactAndCaseInfo.surName} & ${req.body.otherParty.otherPartySurname}`;
                const StringfyData = JSON.stringify(client1data);
                let MajorDataC1 = {
                    fName: req.body.personalContactAndCaseInfo.firstName,
                    sName: req.body.personalContactAndCaseInfo.surName,
                    mail: req.body.personalContactAndCaseInfo.email,
                    phoneNumber: req.body.personalContactAndCaseInfo.phoneNumber
                }

                await Case.findByIdAndUpdate(req.params.id, { client1data: StringfyData, Reference, MajorDataC1 })

                res.status(200).json({ res: "Data of MIAM1-C1 has been updated" })

            }

        }

        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }

});


router.patch('/updateC2M1/:id', authMiddleware, async (req, res, next) => {

    let CaseFound;


    try {

        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                let client2data = req.body
                const StringfyData = JSON.stringify(client2data);
                let Reference = `${req.body.otherParty.otherPartySurname} & ${req.body.personalContactAndCaseInfo.surName}`;

                let MajorDataC2 = {
                    fName: req.body.personalContactAndCaseInfo.firstName,
                    sName: req.body.personalContactAndCaseInfo.surName,
                    mail: req.body.personalContactAndCaseInfo.email,
                    phoneNumber: req.body.personalContactAndCaseInfo.phoneNumber
                }

                await Case.findByIdAndUpdate(req.params.id, { client2data: StringfyData, Reference, MajorDataC2 })
                //console.log(updatedCase)
                res.status(200).json({ res: "Data of MIAM1-C2 has been updated" })

            }

        }
        else if (req.userRole == 'mediator') {
            let cases = await mediator.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                let client2data = req.body
                const StringfyData = JSON.stringify(client2data);
                let Reference = `${req.body.otherParty.otherPartySurname} & ${req.body.personalContactAndCaseInfo.surName}`;

                let MajorDataC2 = {
                    fName: req.body.personalContactAndCaseInfo.firstName,
                    sName: req.body.personalContactAndCaseInfo.surName,
                    mail: req.body.personalContactAndCaseInfo.email,
                    phoneNumber: req.body.personalContactAndCaseInfo.phoneNumber
                }

                await Case.findByIdAndUpdate(req.params.id, { client2data: StringfyData ,Reference, MajorDataC2 })

                res.status(200).json({ res: "Data of MIAM1-C2 has been updated" })

            }

        }

        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }

});
router.patch('/updateC1M2/:id', authMiddleware, async (req, res, next) => {

    let CaseFound;


    try {

        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                let MIAM2mediator = req.body;
                let Reference = `${req.body.mediationDetails.clientSurName} & ${req.body.mediationDetails.clientSurName}`;
                const StringfyData = JSON.stringify(MIAM2mediator);
                let MajorDataC1 = {
                    fName: req.body.mediationDetails.clientFirstName,
                    sName: req.body.mediationDetails.clientSurName,
                    mail: req.body.mediationDetails.clientEmail,
                }
                let MajorDataC2sName = req.body.mediationDetails.otherPartySurname;
                let MIAM_C1_Date = req.body.mediationDetails.DateOfMIAM;

                await Case.findByIdAndUpdate(req.params.id, {
                    MIAM2mediator: StringfyData, Reference, $set: {
                        'MajorDataC1.fName': MajorDataC1.fName,
                        'MajorDataC1.sName': MajorDataC1.sName,
                        'MajorDataC1.mail': MajorDataC1.mail,
                        'MajorDataC2.sName': MajorDataC2sName,
                        'MIAMDates.MIAM_C1_Date': MIAM_C1_Date,


                    }
                })
                //console.log(updatedCase)
                res.status(200).json({ res: "Data of MIAM2-C1 has been updated" })

            }

        }
        else if (req.userRole == 'mediator') {
            let cases = await mediator.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                let MIAM2mediator = req.body
                let Reference = `${req.body.mediationDetails.clientSurName} & ${req.body.mediationDetails.clientSurName}`;
                const StringfyData = JSON.stringify(MIAM2mediator);
                let MajorDataC1 = {
                    fName: req.body.mediationDetails.clientFirstName,
                    sName: req.body.mediationDetails.clientSurName,
                    mail: req.body.mediationDetails.clientEmail,
                }
                let MajorDataC2sName = req.body.mediationDetails.otherPartySurname;
                let MIAM_C1_Date = MIAM2mediator.mediationDetails.DateOfMIAM;

                await Case.findByIdAndUpdate(req.params.id, { MIAM2mediator: StringfyData, Reference,
                    $set: {
                        'MajorDataC1.fName': MajorDataC1.fName,
                        'MajorDataC1.sName': MajorDataC1.sName,
                        'MajorDataC1.mail': MajorDataC1.mail,
                        'MajorDataC2.sName': MajorDataC2sName,
                        'MIAMDates.MIAM_C1_Date': MIAM_C1_Date,


                    } })

                res.status(200).json({ res: "Data of MIAM2-C1 has been updated" })

            }

        }

        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }

});
router.patch('/updateC2M2/:id', authMiddleware, async (req, res, next) => {

    let CaseFound;


    try {

        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                let MIAM2C2 = req.body;
                let Reference = `${req.body.mediationDetails.otherPartySurname} & ${req.body.mediationDetails.clientSurName}`;

                const StringfyData = JSON.stringify(MIAM2C2);
                let MIAM_C2_Date =  req.body.mediationDetails.DateOfMIAM;
                let MajorDataC1sName = req.body.mediationDetails.otherPartySurname;
                let MajorDataC2 = {
                    fName: req.body.mediationDetails.clientFirstName,
                    sName: req.body.mediationDetails.clientSurName,
                    mail: req.body.mediationDetails.clientEmail,
                }

                await Case.findByIdAndUpdate(req.params.id, { MIAM2C2: StringfyData, Reference,
                    $set: {
                        'MajorDataC2.fName': MajorDataC2.fName,
                        'MajorDataC2.sName': MajorDataC2.sName,
                        'MajorDataC2.mail': MajorDataC2.mail,
                        'MajorDataC1.sName': MajorDataC1sName,
                        'MIAMDates.MIAM_C2_Date': MIAM_C2_Date, 
                    } })
                //console.log(updatedCase)
                res.status(200).json({ res: "Data of MIAM2-C2 has been updated" })

            }

        }
        else if (req.userRole == 'mediator') {
            let cases = await mediator.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                let MIAM2C2 = req.body;
                let Reference = `${req.body.mediationDetails.otherPartySurname} & ${req.body.mediationDetails.clientSurName}`;

                const StringfyData = JSON.stringify(MIAM2C2);
                let MIAM_C2_Date =  req.body.mediationDetails.DateOfMIAM;
                let MajorDataC1sName = req.body.mediationDetails.otherPartySurname;
                let MajorDataC2 = {
                    fName: req.body.mediationDetails.clientFirstName,
                    sName: req.body.mediationDetails.clientSurName,
                    mail: req.body.mediationDetails.clientEmail,
                }

                await Case.findByIdAndUpdate(req.params.id, { MIAM2C2: StringfyData, Reference,
                    $set: {
                        'MajorDataC2.fName': MajorDataC2.fName,
                        'MajorDataC2.sName': MajorDataC2.sName,
                        'MajorDataC2.mail': MajorDataC2.mail,
                        'MajorDataC1.sName': MajorDataC1sName,
                        'MIAMDates.MIAM_C2_Date': MIAM_C2_Date, 
                    } })

                res.status(200).json({ res: "Data of MIAM2-C2 has been updated" })

            }

        }

        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }

});


router.patch('/majorDataC1/:id', authMiddleware, async (req, res, next) => {

    let CaseFound;


    try {

        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
            
                let MajorDataC1 = req.body
                await Case.findByIdAndUpdate(req.params.id, { MajorDataC1 })
                res.status(200).json({ res: "Data of major data-C1 has been updated" })

            }

        }
        else if (req.userRole == 'mediator') {
            let cases = await mediator.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                let MajorDataC1 = req.body
                await Case.findByIdAndUpdate(req.params.id, { MajorDataC1 })
                res.status(200).json({ res: "Data of major data-C1 has been updated" })

            }

        }

        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }

});
router.patch('/majorDataC2/:id', authMiddleware, async (req, res, next) => {

    let CaseFound;


    try {

        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
            
                let MajorDataC2 = req.body
                await Case.findByIdAndUpdate(req.params.id, { MajorDataC2 })
                res.status(200).json({ res: "Data of major data-C2 has been updated" })

            }

        }
        else if (req.userRole == 'mediator') {
            let cases = await mediator.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                let MajorDataC2 = req.body
                await Case.findByIdAndUpdate(req.params.id, { MajorDataC2 })
                res.status(200).json({ res: "Data of major data-C2 has been updated" })

            }

        }

        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }

});



module.exports = router;


