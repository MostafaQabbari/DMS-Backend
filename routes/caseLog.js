const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");

const dateNow = require("../global/dateNow");

/*

😒  addCaseLog/:id   =>  patch = > {"logBody" : " "} 

😒  updateCaseLog/:id   =>  patch = > {"logBody" : " "  , "_id" : ""}

😒  deleteCaseLog/:id   =>  delete = > { "_id" : ""}



*/




router.patch('/addCaseLog/:id', authMiddleware, async (req, res) => {

    try {
    
        if (req.userRole == 'company') {
            const logBody = req.body.logBody;
            const subName = req.body.subName;
            const companyId = req.user._id;
            const currentComp = await Company.findById(companyId)
            await Case.findByIdAndUpdate(req.params.id, {
                $push: { caseLogs: { by:`${currentComp.companyName} - ${subName}`, logBody, date: dateNow() } }
            })

            res.status(200).json({ 'res': "new cas log has been added" })

        }

        else if (req.userRole == 'mediator') {
            const logBody = req.body.logBody;
            const medID = req.user._id;
            const currentMed = await Company.findById(medID)

            await Case.findByIdAndUpdate(req.params.id, {
                $push: { caseLogs: { by: `${currentMed.firstName} ${currentMed.lastName}`, logBody, date: dateNow() } }
            })

            res.status(200).json({ 'res': "new  cas log has been added" })

        }

        else {
            res.status(400).json({ 'message': "error in the role of token" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

});



router.patch('/updateCaseLog/:id', authMiddleware, async (req, res) => {

    try {
        if (req.userRole == 'company') {
            const { _id, logBody } = req.body;
            const currentCase = await Case.findById(req.params.id);
            let obj = currentCase.caseLogs.find(obj => obj._id == _id);

            obj.logBody = logBody;
            obj.date = dateNow();
            currentCase.save();
            res.status(200).json({ 'res': " log has been updated" })

        }

        else if (req.userRole == 'mediator') {
            const { _id, logBody } = req.body;
            const currentCase = await Case.findById(req.params.id);
            let obj = currentCase.caseLogs.find(obj => obj._id == _id);

            obj.logBody = logBody;
            obj.date = dateNow();
            currentCase.save();
            res.status(200).json({ 'res': " log has been updated" })

        }

        else {
            res.status(400).json({ 'message': "error in the role of token" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

});

router.delete('/deleteCaseLog/:id/:logID', authMiddleware, async (req, res) => {

    try {
        console.log(req.params)
        if (req.userRole == 'company') {
            const _id = req.params.logID

            const selectedCase = await Case.findById(req.params.id)

            let obj = selectedCase.caseLogs.find(obj => obj._id == _id);
          
                selectedCase.caseLogs.splice(selectedCase.caseLogs.indexOf(obj), 1);
                selectedCase.save();
                res.status(200).json({ 'res': "you have deleted this case log" })
            

        }

        else if (req.userRole == 'mediator') {
            const _id =  req.params.logID

            const selectedCase = await Case.findById(req.params.id)

            let obj = selectedCase.caseLogs.find(obj => obj._id == _id);
          
                selectedCase.caseLogs.splice(selectedCase.caseLogs.indexOf(obj), 1);
                selectedCase.save();
                res.status(200).json({ 'res': "you have deleted this case log" })
        }

        else {
            res.status(400).json({ 'message': "error in the role of token" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

});



module.exports = router;
