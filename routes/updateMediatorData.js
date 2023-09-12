const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const mediator = require('../models/mediator');
const Company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");


router.get("/get-mediator-details/:id", authMiddleware, async (req, res) => {
    try {
        if (req.userRole == 'company') {
            const mediatorsIDs = req.user.mediators;
            let medFound=false

            for (let i = 0; i < mediatorsIDs.length; i++) {

                if (mediatorsIDs[i] == req.params.id) {
                    medFound=true
                    const med = await mediator.findById(mediatorsIDs[i]);
                  
                    res.status(200).json({
                        firstName: med.firstName, lastName: med.lastName, email: med.email
                    })
                }
            }
            if(!medFound)
            {
                
                    res.status(400).json({ "Err": "not found mediator" })
                
            }
        }
        else {
            res.status(400).json({ "Err": "error with account role" })
        }
    } catch (err) {
        res.status(400).json({ "Err": err.message })
    }


})

router.patch("/update-mediator-data/:id", authMiddleware, async (req, res) => {
    try {
        // {firstName ,lastName ,email}
        const mediatorData = req.body
        let medFound=false
        if (req.userRole == 'company') {
            const mediatorsIDs = req.user.mediators;

            for (let i = 0; i < mediatorsIDs.length; i++) {

                if (mediatorsIDs[i] == req.params.id) {
                    const existingMediator = await mediator.findOne({ email: req.body.email });
                    if (existingMediator && existingMediator._id.toString() !== req.params.id.toString()) {
                        return res.status(400).json({ "Err": "this mail has been used before ..." });
                    }
                    medFound=true
                  await mediator.findByIdAndUpdate(req.params.id, mediatorData);
                    res.status(200).json({ "message": "mediator data has been updated ... " })
                }
           

            }
            if(!medFound)
            {
                
                    res.status(400).json({ "Err": "not found mediator" })
                
            }
        }
        else {
            res.status(400).json({ "Err": "error with account role" })
        }
    } catch (err) {
        res.status(400).json({ "Err": err.message })
    }


})

router.delete("/remove-mediator/:id", authMiddleware, async (req, res) => {
    try {

        if (req.userRole == 'company') {
            const mediatorsIDs = req.user.mediators;
            let medFound=false
            for (let i = 0; i < mediatorsIDs.length; i++) {

                if (mediatorsIDs[i] == req.params.id) {
                    medFound = true
                    const pullMed = await Company.findByIdAndUpdate(req.user._id, {
                        $pull: { mediators: req.params.id }
                    })
                  
                        await mediator.findByIdAndRemove(req.params.id);

                        res.status(200).json({ "message": "mediator data has been removed ... " })
                    

                }
                
             

            }
            if(!medFound)
            {
                
                    res.status(400).json({ "Err": "not found mediator" })
                
            }
     
        }
        else {
            res.status(400).json({ "Err": "error with account role" })
        }
    } catch (err) {
        res.status(400).json({ "Err": err.message })
    }


})

/*
.get("/get-mediator-details/:id"
.patch("/update-mediator-data/:id"  =  >    // {firstName ,lastName ,email}
.delete("/remove-mediator/:id"

*/

module.exports = router