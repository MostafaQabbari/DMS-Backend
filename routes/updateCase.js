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
            if(CaseFound){
                let client1data = req.body
                let Reference = `${req.body.personalContactAndCaseInfo.surName}& ${req.body.otherParty.otherPartySurname}`;
                const StringfyData = JSON.stringify(client1data)
        
             await Case.findByIdAndUpdate(req.params.id, { client1data: StringfyData, Reference })
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
            if(CaseFound){
                let client1data = req.body
                let Reference = `${req.body.personalContactAndCaseInfo.surName}& ${req.body.otherParty.otherPartySurname}`;
                const StringfyData = JSON.stringify(client1data)
        
                await Case.findByIdAndUpdate(req.params.id, { client1data: StringfyData, Reference })
        
                res.status(200).json({ res: "Data of MIAM1-C1 has been updated" })
        
            }

        }

        else{
            res.status(400).json({res : "there is an arror with getting case access for the user"})
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
            if(CaseFound){
                let client2data = req.body
                const StringfyData = JSON.stringify(client2data)
        
      await Case.findByIdAndUpdate(req.params.id, { client2data: StringfyData })
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
            if(CaseFound){
                let client2data = req.body
                const StringfyData = JSON.stringify(client2data)
        
                await Case.findByIdAndUpdate(req.params.id, { client2data: StringfyData })
        
                res.status(200).json({ res: "Data of MIAM1-C2 has been updated" })
        
            }

        }

        else{
            res.status(400).json({res : "there is an arror with getting case access for the user"})
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
            if(CaseFound){
                let MIAM2mediator = req.body;
                let Reference = `${req.body.mediationDetails.clientSurName} & ${currentCase.MajorDataC2.sName}`;

                const StringfyData = JSON.stringify(MIAM2mediator)
        
      await Case.findByIdAndUpdate(req.params.id, { MIAM2mediator: StringfyData ,Reference })
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
            if(CaseFound){
                let MIAM2mediator = req.body
                let Reference = `${req.body.mediationDetails.clientSurName} & ${currentCase.MajorDataC2.sName}`;
                const StringfyData = JSON.stringify(MIAM2mediator)
        
                await Case.findByIdAndUpdate(req.params.id, { MIAM2mediator: StringfyData ,Reference })
        
                res.status(200).json({ res: "Data of MIAM2-C1 has been updated" })
        
            }

        }

        else{
            res.status(400).json({res : "there is an arror with getting case access for the user"})
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
            if(CaseFound){
                let MIAM2C2 = req.body;
                let Reference = `${req.body.mediationDetails.otherPartySurname} & ${req.body.mediationDetails.clientSurName}`;

                const StringfyData = JSON.stringify(MIAM2C2)
        
      await Case.findByIdAndUpdate(req.params.id, { MIAM2C2: StringfyData ,Reference })
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
            if(CaseFound){
                let MIAM2C2 = req.body;
                let Reference = `${req.body.mediationDetails.otherPartySurname} & ${req.body.mediationDetails.clientSurName}`;

                const StringfyData = JSON.stringify(MIAM2C2)
        
                await Case.findByIdAndUpdate(req.params.id, { MIAM2C2: StringfyData ,Reference })
        
                res.status(200).json({ res: "Data of MIAM2-C2 has been updated" })
        
            }

        }

        else{
            res.status(400).json({res : "there is an arror with getting case access for the user"})
        }

    

    } catch (err) {
        res.status(400).json(err.message)
    }

});






module.exports = router;


