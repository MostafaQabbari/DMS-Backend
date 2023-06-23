const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");







router.patch('/addRemider', authMiddleware, async (req, res, next) => {

    try {
        if (req.userRole == 'company') {
            const { reminderTitle, startDate } = req.body;
            const companyId = req.user._id;
            await Company.findByIdAndUpdate(companyId, {
                $push: { Reminders: { reminderTitle, startDate } }
            })

            res.json({ 'res': "new reminder has been added" })

        }

        else if (req.userRole == 'mediator') {
            const { reminderTitle, startDate } = req.body;
            const medID = req.user._id;

            await mediator.findByIdAndUpdate(medID, {
                $push: { Reminders: { reminderTitle, startDate } }
            })

            res.json({ 'res': "new reminder has been added" })

            // const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');
            // const compID = mediatorCompanyData.companyId._id;
            // await Company.findByIdAndUpdate(compID, { $push: { cases: newCase[0]._id } });
            //await mediator.findByIdAndUpdate(medID, { $push: { cases: newCase[0]._id } });

        }

        else {
            res.json({ 'message': "error in the role of token" })
        }
    } catch (err) {
        res.json({ message: err.message })
    }

});

router.get('/getReminders', authMiddleware, async (req, res, next) => {

    try {
        if (req.userRole == 'company') {

            const companyId = req.user._id;
            const selectedComp = await Company.findById(companyId);
            const userReminders = selectedComp.Reminders

            const mediatorsList = await Company.findById(req.user._id).populate('mediators');
            const casesList = await Company.findById(req.user._id).populate('cases');
            let Reminders = [
                { "compReminders": userReminders }
            ]

            for (let i = 0; i < mediatorsList.mediators.length; i++) {
                let medName = `${mediatorsList.mediators[i].firstName} ${mediatorsList.mediators[i].lastName}`;
                let medReminders = mediatorsList.mediators[i].Reminders
                Reminders.push({ medName: medName, Reminders: medReminders })

            }
            for (let i = 0; i < casesList.cases.length; i++) {

                let caseStatusReminders = casesList.cases[i].Reminders.statusRemider;
                let caseReference = casesList.cases[i].Reference;
                Reminders.push({ caseReference: caseReference, Reminder: caseStatusReminders })

            }



            res.json(Reminders)

        }

        else if (req.userRole == 'mediator') {

            const medID = req.user._id;
            const selectedMed = await mediator.findById(medID);
            const userReminders = selectedMed.Reminders;

            const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');
            const casesList = await mediator.findById(req.user._id).populate('cases');

            const compReminders = mediatorCompanyData.companyId.Reminders

            let Reminders = [
                { "companyReminders": compReminders },
                { "MediatorReminder": userReminders },


            ]
            for (let i = 0; i < casesList.cases.length; i++) {

                let caseStatusReminders = casesList.cases[i].Reminders.statusRemider;
                let caseReference = casesList.cases[i].Reference;
                Reminders.push({ caseReference: caseReference, Reminder: caseStatusReminders })

            }



            res.json(Reminders)
        }

        else {
            res.json({ 'message': "error in the role of token" })
        }
    } catch (err) {
        res.json({ message: err.message })
    }

});
router.patch('/updateReminder', authMiddleware, async (req, res, next) => {

    try {
        if (req.userRole == 'company') {
            const { _id, reminderTitle, startDate } = req.body;
            const companyId = req.user._id;
            const selectedComp = await Company.findById(companyId);
            let obj = selectedComp.Reminders.find(obj => obj._id == _id);
            if (obj) {
                obj.reminderTitle = reminderTitle;
                obj.startDate = startDate;
                selectedComp.save();
                res.json({ 'res': "reminder has been updated" })
            } else {
                res.json({ 'res': "you don't have access on this reminder" })
            }
        }

        else if (req.userRole == 'mediator') {
            const { _id, reminderTitle, startDate } = req.body;
            const medID = req.user._id;
            const selectedMed = await mediator.findById(medID)
            let obj = selectedMed.Reminders.find(obj => obj._id == _id);
            if (obj) {
                obj.reminderTitle = reminderTitle;
                obj.startDate = startDate;
                selectedMed.save();
                res.json({ 'res': "reminder has been updated" })
            } else {
                res.json({ 'res': "you don't have access on this reminder" })
            }

        }

        else {
            res.json({ 'message': "error in the role of token" })
        }
    } catch (err) {
        res.json({ message: err.message })
    }

});

router.patch('/deleteReminder', authMiddleware, async (req, res, next) => {

    try {
        if (req.userRole == 'company') {
            const { _id } = req.body;
            const companyId = req.user._id;
            const selectedComp = await Company.findById(companyId)

            let obj = selectedComp.Reminders.find(obj => obj._id == _id);
            if (obj) {
                selectedComp.Reminders.splice(selectedComp.Reminders.indexOf(obj), 1);
                selectedComp.save();
                res.json({ 'res': "you have deleted this reminder" })
            } else {
                res.json({ 'res': "you don't have access on this reminder" })
            }

        }

        else if (req.userRole == 'mediator') {
            const { _id } = req.body;
            const medID = req.user._id;
            const selectedMed = await mediator.findById(medID)
            let obj = selectedMed.Reminders.find(obj => obj._id == _id);
            if (obj) {
                selectedMed.Reminders.splice(selectedMed.Reminders.indexOf(obj), 1);
                selectedMed.save();
                res.json({ 'res': "you have deleted this reminder" })
            } else {
                res.json({ 'res': "you don't have access on this reminder" })
            }

        }

        else {
            res.json({ 'message': "error in the role of token" })
        }
    } catch (err) {
        res.json({ message: err.message })
    }

});




module.exports = router;