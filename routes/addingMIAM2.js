const { Console } = require('console');
const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');

router.patch("/addingMIAM2/:id", authMiddleware, async (req, res) => {


    // const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
    // const med_id = medData.connectionData.mediatorID;

    try {

        let MIAM2mediator = req.body;
        let currentCase = await Case.findById(req.params.id);
        const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
        const med_id = medData.connectionData.mediatorID._id;

        // console.log(med_id)
        // console.log(req.user._id)
        // console.log(med_id.toString() == req.user._id.toString())
        if (!currentCase.MIAM2AddedData) {

            if (med_id.toString() == req.user._id.toString()) {
                // console.log(med_id)
                // console.log(req.user._id)

                const updatedCase = await Case.findByIdAndUpdate(req.params.id, { MIAM2mediator, MIAM2AddedData: true })
                console.log(updatedCase.MIAM2mediator[0])
                res.json({ "message ": "right mediator" })
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
