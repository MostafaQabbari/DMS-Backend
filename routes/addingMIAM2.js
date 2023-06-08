
const express = require('express');
const router = express.Router();
const Case = require('../models/case');


router.patch("/addingMIAM2/:id", async (req, res) => {


    try {

        let MIAM2mediator = req.body;
        let currentCase = await Case.findById(req.params.id);
        console.log(MIAM2mediator)
        console.log(currentCase)
        // const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
        // const med_id = medData.connectionData.mediatorID._id;

        const stringfyMIAM2Data = JSON.stringify(MIAM2mediator)
        if (!currentCase.MIAM2AddedData) {

            await Case.findByIdAndUpdate(req.params.id, { MIAM2mediator: stringfyMIAM2Data, MIAM2AddedData: true })
            //     if (med_id.toString() == req.user._id.toString()) {

            //   const   parsedMIAM2Data =JSON.parse(stringfyMIAM2Data)
            //         res.json({ "MIAM2 DATA ": parsedMIAM2Data })
            //     }
            //     else {
            //         res.json({ "message ": "wrong mediator" })
            //     }

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
