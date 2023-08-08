const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");
const nodemailer = require("nodemailer")

const dateNow = require("../global/dateNow")

router.patch("/closeTheCase/:id", authMiddleware, async (req, res) => {

    let CaseFound;


    try {
      
        let currentCase = await Case.findById(req.params.id);
        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                let caseClosed = "Closed"
                let statusRemider = {
                    reminderID: `${currentCase._id}-statusRemider`,
                    reminderTitle: `${currentCase.Reference}-${caseClosed}`,
                    startDate: dateNow()
                }

                await Case.findByIdAndUpdate(req.params.id, { status: caseClosed, closed: true ,
                    $set: {'Reminders.statusRemider': statusRemider } })
                res.status(200).json({ res: `Case Status updated to be ${caseClosed}` })

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
                let caseClosed ="Closed";
                let statusRemider = {
                    reminderID: `${currentCase._id}-statusRemider`,
                    reminderTitle: `${currentCase.Reference}-${caseClosed}`,
                    startDate: dateNow()
                }
                await Case.findByIdAndUpdate(req.params.id, { status: caseClosed, closed: true ,  
                    $set: {'Reminders.statusRemider': statusRemider } })
                res.status(200).json({ res: `Case Status updated to be ${caseClosed}` })

            }

        }

        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }


})

router.patch("/updateCaseStatus/:id", authMiddleware, async (req, res) => {

    let CaseFound;


    try {
        let{newStatus} = req.body
        let currentCase = await Case.findById(req.params.id);

        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                let newStatus = req.body.newStatus;
                let statusRemider = {
                    reminderID: `${currentCase._id}-statusRemider`,
                    reminderTitle: `${currentCase.Reference}-${newStatus}`,
                    startDate: dateNow()
                }
                await Case.findByIdAndUpdate(req.params.id, {
                    status: newStatus, closed: false, $set: {

                        'Reminders.statusRemider': statusRemider

                    }
                })
                res.status(200).json({ res: `Case Status updated to be ${newStatus}` })

            }

        }
        else if (req.userRole == 'mediator') {
            let cases = await mediator.findById(req.user._id).populate('cases');  
               let statusRemider = {
                reminderID: `${currentCase._id}-statusRemider`,
                reminderTitle: `${currentCase.Reference}-${newStatus}`,
                startDate: dateNow()
            }

            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                let newStatus = req.body.newStatus
                await Case.findByIdAndUpdate(req.params.id, { status: newStatus, closed: false ,
                   $set: {'Reminders.statusRemider': statusRemider }
                 })
                res.status(200).json({ res: `Case Status updated to be ${newStatus}` })

            }

        }

        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }


});

router.patch("/converToprivate_C1/:id", authMiddleware, async (req, res) => {
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
         
                await Case.findByIdAndUpdate(req.params.id, { caseTypeC1:"Private"})
                res.status(200).json({ res: `Case coverted to private funding` })

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
                await Case.findByIdAndUpdate(req.params.id, { caseTypeC1:"Private"})
                res.status(200).json({ res: `Case coverted to private funding` })

            }

        }

        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }



})
router.patch("/converToprivate_C2/:id", authMiddleware, async (req, res) => {
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
         
                await Case.findByIdAndUpdate(req.params.id, { caseTypeC2:"Private"})
                res.status(200).json({ res: `Case coverted to private funding` })

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
                await Case.findByIdAndUpdate(req.params.id, { caseTypeC2:"Private"})
                res.status(200).json({ res: `Case coverted to private funding` })

            }

        }

        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }



})


router.patch("/converToLegalAid_C1/:id", authMiddleware, async (req, res) => {
    let CaseFound;
    try {
      
        const {caseType} = req.body
        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
         
                await Case.findByIdAndUpdate(req.params.id, { caseTypeC1:caseType})
                res.status(200).json({ res: `Case coverted to ${caseType}` })

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
                await Case.findByIdAndUpdate(req.params.id, { caseTypeC1:caseType})
                res.status(200).json({ res: `Case coverted to  ${caseType}` })

            }

        }

        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }



})
router.patch("/converToLegalAid_C2/:id", authMiddleware, async (req, res) => {
    let CaseFound;
    try {
      
        const {caseType} = req.body
        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
         
                await Case.findByIdAndUpdate(req.params.id, { caseTypeC2:caseType})
                res.status(200).json({ res: `Case coverted to ${caseType}` })

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
                await Case.findByIdAndUpdate(req.params.id, { caseTypeC2:caseType})
                res.status(200).json({ res: `Case coverted to  ${caseType}` })

            }

        }

        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }



})



module.exports = router;