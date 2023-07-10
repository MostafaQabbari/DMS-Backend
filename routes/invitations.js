const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");







router.patch('/sendInvite_C1', authMiddleware, async (req, res, next) => {

    try {
        if (req.userRole == 'company') {
            const { reminderTitle, startDate } = req.body;
            const companyId = req.user._id;
            await Company.findByIdAndUpdate(companyId, {
                $push: { Reminders: { reminderTitle, startDate } }
            })

            res.json({ 'res': "new reminder has been added" })

        }

        else if (req.userRole == 'mediator') {
            const { reminderTitle, startDate } = req.body;
            const medID = req.user._id;

            await mediator.findByIdAndUpdate(medID, {
                $push: { Reminders: { reminderTitle, startDate } }
            })

            res.json({ 'res': "new reminder has been added" })

            // const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');
            // const compID = mediatorCompanyData.companyId._id;
            // await Company.findByIdAndUpdate(compID, { $push: { cases: newCase[0]._id } });
            //await mediator.findByIdAndUpdate(medID, { $push: { cases: newCase[0]._id } });

        }

        else {
            res.json({ 'message': "error in the role of token" })
        }
    } catch (err) {
        res.json({ message: err.message })
    }

});






module.exports = router;