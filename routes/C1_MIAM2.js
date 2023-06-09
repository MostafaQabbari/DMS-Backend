
const express = require('express');
const router = express.Router();
const Case = require('../models/case');


router.patch("/addC1MIAM2/:id", async (req, res) => {


    try {

        let MIAM2mediator = req.body;
        let currentCase = await Case.findById(req.params.id);
        const stringfyMIAM2Data = JSON.stringify(MIAM2mediator)
        if (!currentCase.MIAM2AddedData) {

            await Case.findByIdAndUpdate(req.params.id, { MIAM2mediator: stringfyMIAM2Data, MIAM2AddedData: true , status:"C1 MIAM Part 2 Applied" })
        
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
