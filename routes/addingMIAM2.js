
const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');

router.patch("/addingMIAM2/:id", authMiddleware, async (req, res) => {


    try {

        let MIAM2mediator = req.body;
        let currentCase = await Case.findById(req.params.id);
        const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
        const med_id = medData.connectionData.mediatorID._id;

        const   stringfyMIAM2Data =JSON.stringify(MIAM2mediator)
        if (!currentCase.MIAM2AddedData) {

            if (med_id.toString() == req.user._id.toString()) {
                // console.log(med_id)
                // console.log(req.user._id)

                const updatedCase = await Case.findByIdAndUpdate(req.params.id, { MIAM2mediator:stringfyMIAM2Data, MIAM2AddedData: true })
               
          const   parsedMIAM2Data =JSON.parse(stringfyMIAM2Data)
                res.json({ "MIAM2 DATA ": parsedMIAM2Data })
            }
            else {
                res.json({ "message ": "wrong mediator" })
            }
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
