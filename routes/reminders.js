const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");







router.patch('/addRemider', authMiddleware, async (req, res) => {

    try {
        if (req.userRole == 'company') {
            const { reminderTitle, startDate } = req.body;
            const companyId = req.user._id;
            await Company.findByIdAndUpdate(companyId, {
                $push: { Reminders: { reminderTitle, startDate } }
            })

            res.status(200).json({ 'res': "new reminder has been added" })

        }

        else if (req.userRole == 'mediator') {
            const { reminderTitle, startDate } = req.body;
            const medID = req.user._id;

            await mediator.findByIdAndUpdate(medID, {
                $push: { Reminders: { reminderTitle, startDate } }
            })

            res.status(200).json({ 'res': "new reminder has been added" })

            // const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');
            // const compID = mediatorCompanyData.companyId._id;
            // await Company.findByIdAndUpdate(compID, { $push: { cases: newCase[0]._id } });
            //await mediator.findByIdAndUpdate(medID, { $push: { cases: newCase[0]._id } });

        }

        else {
            res.status(400).json({ 'message': "error in the role of token" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

});

router.get('/getReminders', authMiddleware, async (req, res) => {

    try {
        if (req.userRole == 'company') {
            /**
             {
                creator:
                mediatorName:
                companyName:
                caseReference:
                id: createEventId(),
                title: "All-day event",
                start: todayStr + "T02:00:00",
                
              }
             */
            const companyId = req.user._id;
            const selectedComp = await Company.findById(companyId);
            const userReminders = selectedComp.Reminders;
        

            const mediatorsList = await Company.findById(req.user._id).populate('mediators');
            const casesList = await Company.findById(req.user._id).populate('cases');

            let Reminders = []


            for (let i = 0; i < userReminders.length; i++) {
                let reminderObj = {}
                reminderObj.id = userReminders[i]._id
                reminderObj.title = userReminders[i].reminderTitle
                reminderObj.start = userReminders[i].startDate
                reminderObj.creator = "company"
                reminderObj.companyName = selectedComp.companyName
                Reminders.push(reminderObj)

            }

            for (let i = 0; i < mediatorsList.mediators.length; i++) {
                let medName = `${mediatorsList.mediators[i].firstName} ${mediatorsList.mediators[i].lastName}`;
                let medReminders = mediatorsList.mediators[i].Reminders;
                let reminderObj = {}
                for (let j = 0; j < medReminders.length; j++) {

                    reminderObj.id = medReminders[i]._id
                    reminderObj.title = medReminders[i].reminderTitle
                    reminderObj.start = medReminders[i].startDate
                    reminderObj.creator = "mediator"
                    reminderObj.mediatorName = medName
                    Reminders.push(reminderObj)


                }

            }
            for (let i = 0; i < casesList.cases.length; i++) {

                let caseStatusReminders = casesList.cases[i].Reminders.statusRemider;
                let caseReference = casesList.cases[i].Reference;
                let reminderObj = {};
                reminderObj.id = caseStatusReminders.reminderID
                reminderObj.title = caseStatusReminders.reminderTitle
                reminderObj.start = caseStatusReminders.startDate
                reminderObj.creator = "caseStatus"
                reminderObj.caseReference = caseReference;
                Reminders.push(reminderObj)


                for(let rem=0 ; rem<casesList.cases[i].Reminders.eventReminders.length ; rem++)
                {
                    let eventReminders = casesList.cases[i].Reminders.eventReminders[rem];
                    let eventReminderObj = {}
                    
                    eventReminderObj.id = eventReminders._id
                    eventReminderObj.title = eventReminders.reminderTitle
                    eventReminderObj.start = eventReminders.startDate
                    eventReminderObj.creator = "Event Reminder"
                    eventReminderObj.caseReference = caseReference;
                 
                    Reminders.push(eventReminderObj)

                }
             






            }



            res.status(200).json(Reminders)

        }

        else if (req.userRole == 'mediator') {

            const medID = req.user._id;
            const selectedMed = await mediator.findById(medID);
            let medName = `${selectedMed.firstName} ${selectedMed.lastName}`;
            
            const userReminders = selectedMed.Reminders;
            
            const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');
            const casesList = await mediator.findById(req.user._id).populate('cases');
            const compName =  mediatorCompanyData.companyId.companyName
            
            const compReminders = mediatorCompanyData.companyId.Reminders;
            const casesReminders = []
            
           // console.log("👌👌👌",userReminders)
            let Reminders = []
            for (let i = 0; i < compReminders.length; i++) {
                let reminderObj = {}
                reminderObj.id = compReminders[i]._id
                reminderObj.title = compReminders[i].reminderTitle
                reminderObj.start = compReminders[i].startDate
                reminderObj.creator = "company"
                reminderObj.companyName = compName
                Reminders.push(reminderObj)
                
            }
            
            for (let i = 0; i < userReminders.length; i++) {
                let reminderObj = {}
                reminderObj.id = userReminders[i]._id
                reminderObj.title = userReminders[i].reminderTitle
                reminderObj.start = userReminders[i].startDate
                reminderObj.creator = "mediator"
                reminderObj.mediatorName = medName
                Reminders.push(reminderObj)
           //     console.log('😒😒😒😒',Reminders)

            }
            for (let i = 0; i < casesList.cases.length; i++) {

                let caseStatusReminders = casesList.cases[i].Reminders.statusRemider;
                let caseReference = casesList.cases[i].Reference;
                let reminderObj = {}
                reminderObj.id = caseStatusReminders.reminderID
                reminderObj.title = caseStatusReminders.reminderTitle
                reminderObj.start = caseStatusReminders.startDate
                reminderObj.creator = "caseStatus"
                reminderObj.caseReference = caseReference;
                Reminders.push(reminderObj);

                for(let rem=0 ; rem<casesList.cases[i].Reminders.eventReminders.length ; rem++)
                {
                    let eventReminders = casesList.cases[i].Reminders.eventReminders[rem];
                    let eventReminderObj = {}
    
                  
                    eventReminderObj.id = eventReminders._id
                    eventReminderObj.title = eventReminders.reminderTitle
                    eventReminderObj.start = eventReminders.startDate
                    eventReminderObj.creator = "Event Reminder"
                    eventReminderObj.caseReference = caseReference;
                    Reminders.push(eventReminderObj)

                }

            }



            res.status(200).json(Reminders)
        }

        else {
            res.status(400).json({ 'message': "error in the role of token" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

});
router.patch('/updateReminder', authMiddleware, async (req, res) => {

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
                res.status(200).json({ 'res': "reminder has been updated" })
            } else {
                res.status(200).json({ 'res': "you don't have access on this reminder" })
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
                res.status(200).json({ 'res': "reminder has been updated" })
            } else {
                res.status(200).json({ 'res': "you don't have access on this reminder" })
            }

        }

        else {
            res.status(400).json({ 'message': "error in the role of token" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

});

router.delete('/deleteReminder/:_id', authMiddleware, async (req, res) => {

    try {
        if (req.userRole == 'company') {
           const  _id  = req.params._id;
           
            const companyId = req.user._id;
            const selectedComp = await Company.findById(companyId)

            let obj = selectedComp.Reminders.find(obj => obj._id == _id);
            if (obj) {
                selectedComp.Reminders.splice(selectedComp.Reminders.indexOf(obj), 1);
                selectedComp.save();
                res.status(200).json({ 'res': "you have deleted this reminder" })
            } else {
                res.status(200).json({ 'res': "you don't have access on this reminder" })
            }

        }

        else if (req.userRole == 'mediator') {
            const  _id  = req.params._id;
            const medID = req.user._id;
            const selectedMed = await mediator.findById(medID)
            let obj = selectedMed.Reminders.find(obj => obj._id == _id);
            if (obj) {
                selectedMed.Reminders.splice(selectedMed.Reminders.indexOf(obj), 1);
                selectedMed.save();
                res.status(200).json({ 'res': "you have deleted this reminder" })
            } else {
                res.status(200).json({ 'res': "you don't have access on this reminder" })
            }

        }

        else {
            res.status(400).json({ 'message': "error in the role of token" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

});



router.patch("/adding-event-reminder/:id" , authMiddleware , async(req, res)=>{

    
    try {
        let eventReminderdata = req.body;
        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {

                await Case.findByIdAndUpdate(req.params.id, {
                    $push: { 'Reminders.eventReminders': eventReminderdata }
                })
                res.status(200).json({ "message": " Event Reminder has been added ... " })
                


            }
            else {
                res.status(400).json({ "message": "no case found ... " })
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

                await Case.findByIdAndUpdate(req.params.id, {
                    $push: { 'Reminders.eventReminders': eventReminderdata }
                })
                res.status(200).json({ "message": " Event Reminder has been added ... " })
                

            
              
            }
            else {
                res.status(400).json({ "message": "no case found ... " })
            }

        }




        else {
            res.status(400).json({ 'message': "error in the role of token" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

})


module.exports = router;
