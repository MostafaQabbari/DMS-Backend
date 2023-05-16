const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer")
const twillioMiddleware = require('../middleware/getDataFromPromise');
const config = require("../config/config");



router.post("/addClient1/:id", async (req, res) => {

 
try{
    let currentCase = await Case.findById(req.params.id);
    let client1data=req.body
    let Reference=`${req.body.personalInfo.surName}& ${req.body.Client2Details.SurName}`

    if(!currentCase.client1AddedData)
    {

        let updatedCase = await Case.findByIdAndUpdate(req.params.id, { client1data ,Reference , client1AddedData:true})
        res.json(updatedCase)

    }
    else{
        res.json({"message" : "this from has been applied before"})

    }
}catch(err){
    res.json({"message" : "error with adding client1 data"})
}


})



module.exports = router;