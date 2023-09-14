const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");


router.get("/getMediators", authMiddleware, async (req, res) => {
    try {
        if (req.userRole == 'company') {
            const mediatorsIDs = req.user.mediators;
            let response = [];
            for (let i = 0; i < mediatorsIDs.length; i++) {
                const med = await mediator.findById(mediatorsIDs[i]);
                response.push({ name: `${med.firstName} ${med.lastName}`, email: med.email , id:med._id })

            }
            console.log(response)

            res.status(200).json(response)

        }
        else {
            res.status(400).json({ message: "error with account role" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }


})



module.exports = router;
