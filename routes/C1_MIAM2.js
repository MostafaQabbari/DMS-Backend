
const express = require('express');
const router = express.Router();
const Case = require('../models/case');


router.patch("/addC1MIAM2/:id", async (req, res) => {


    try {

        let MIAM2mediator = req.body;
        let MajorDataC1 = {
            fName: req.body.mediationDetails.clientFirstName,
            sName: req.body.mediationDetails.clientSurName,
            mail: req.body.mediationDetails.clientEmail,
        }

        let MajorDataC2sName = req.body.mediationDetails.otherPartySurname;



        let currentCase = await Case.findById(req.params.id);
       // console.log("xxx",currentCase.MajorDataC2)
        const stringfyMIAM2Data = JSON.stringify(MIAM2mediator)
        //!currentCase.MIAM2AddedData
        if (currentCase.MIAM2AddedData) {

            await Case.findByIdAndUpdate(req.params.id, {
                $set: {
                    'MajorDataC1.fName': MajorDataC1.fName,
                    'MajorDataC1.sName': MajorDataC1.sName,
                    'MajorDataC1.mail': MajorDataC1.mail,
                    'MajorDataC2.sName': MajorDataC2sName
                }, MIAM2mediator: stringfyMIAM2Data, MIAM2AddedData: true, status: "MIAM Part 2-C1"
            })

            res.json({ "message": " MIAM2 has been added " })
        }
        else {
            res.json({ "message": "this MIAM2 has been added before" })
        }


    }
    catch (Err) {
        res.json({ "err": Err.message })
    }




})





module.exports = router;
