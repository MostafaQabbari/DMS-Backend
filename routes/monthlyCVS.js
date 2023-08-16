const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");

const csv = require('csv-parser');
const fs = require('fs');


router.get("/get-monthly-csv", authMiddleware, async (req, res) => {


    try {

        let resData = [] ;
       
        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
              let  resDataobj = cases.cases[i].startDate;
              resData.push(resDataobj)
                console.log(cases.cases[i].startDate)
            } 
 

            res.status(200).json(resData)
        }

        else {
            res.status(400).json({ 'message': "not auth user ..." })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

})


module.exports = router;
