const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const mediator = require('../models/mediator');
const Company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");



router.patch("/replaceMediator/:id", authMiddleware, async (req, res) => {
    // { mediatorMail : "mediatorMail"}
    try {
        let NewMediatorMail = req.body.mediatorMail
        const NewMediatorData = await mediator.findOne({ email: NewMediatorMail });
        if(NewMediatorData)
        {
            if (req.userRole == "company") {

                let cases = await Company.findById(req.user._id).populate('cases');
    
                for (let i = 0; i < cases.cases.length; i++) {
                    if (cases.cases[i]._id == req.params.id) {
    
                        CaseFound = (cases.cases[i])
                    }
                }
                if (CaseFound) {
                    const oldMediator = await Case.findById(req.params.id).populate('connectionData.mediatorID');
                    const oldMediatorID = oldMediator.connectionData.mediatorID._id;
    
                    // console.log(oldMediator.connectionData.mediatorID.email, "📢 old med from  the case")
                    // console.log(NewMediatorData.email, "📢 new med from  input")
    
    
                    const pullCaseFromMed = await mediator.findByIdAndUpdate(oldMediatorID, {
                        $pull: { cases: CaseFound._id }
                    })
                    if (pullCaseFromMed) {
                        const pushCaseToMed = await mediator.findByIdAndUpdate(NewMediatorData._id, {
                            $push: { cases: CaseFound._id }
                        })
                        if(pushCaseToMed)
                        {
                            await Case.findByIdAndUpdate(req.params.id, {
                                $set: {
                                    'connectionData.mediatorID': NewMediatorData._id
                                }
                            })
                        }
                    }
    
                
    
                    res.status(200).json({ 'meesage': "Mediator have been replaced " })
                }
                else {
                    res.status(400).json(" you don't have the access on this case ")
                }
    
            }
            else {
                res.status(400).json("err with user Auth")
            }

        }
        else {
            res.status(400).json("there no med with this mail ... ")
        }
       
   
       

    } catch (err) {
        res.status(400).json(err.message)
    }


})




module.exports = router

/*
connectionData: { companyID: req.user._id, mediatorID: Themediator._id },
*/