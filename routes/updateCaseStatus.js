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
                let caseClosed = req.body.newStatus;
                let statusRemider = {
                    reminderID: `${currentCase._id}-statusRemider`,
                    reminderTitle: `${currentCase.Reference}-${caseClosed}`,
                    startDate: dateNow()
                }
                console.log(caseClosed)
                await Case.findByIdAndUpdate(req.params.id, { status: caseClosed, closed: true ,
                    $set: {'Reminders.statusRemider': statusRemider } })
                res.json({ res: `Case Status updated to be ${caseClosed}` })

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
                let caseClosed = req.body.newStatus;
                let statusRemider = {
                    reminderID: `${currentCase._id}-statusRemider`,
                    reminderTitle: `${currentCase.Reference}-${caseClosed}`,
                    startDate: dateNow()
                }
                await Case.findByIdAndUpdate(req.params.id, { status: caseClosed, closed: true ,  
                    $set: {'Reminders.statusRemider': statusRemider } })
                res.json({ res: `Case Status updated to be ${caseClosed}` })

            }

        }

        else {
            res.json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.json(err.message)
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
                res.json({ res: `Case Status updated to be ${newStatus}` })

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
                res.json({ res: `Case Status updated to be ${newStatus}` })

            }

        }

        else {
            res.json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.json(err.message)
    }


})




module.exports = router;