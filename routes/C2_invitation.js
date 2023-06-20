const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");




router.patch("/C2_invitation/:id", async (req, res) => {


  try {

    let currentCase = await Case.findById(req.params.id);
    let C2invitation = req.body

    const StringfyData = JSON.stringify(C2invitation)

    const companyData = await Case.findById(req.params.id).populate('connectionData.companyID');
    const companyEmail = companyData.connectionData.companyID.email;

    const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
    const medEmail = medData.connectionData.mediatorID.email;
    
    mediatorData.name = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;
    mediatorData.email = medEmail


    // messageBodyinfo.formUrl = `${config.baseUrlMIAM2}/${config.MIAM_PART_2}/${updatedCase._id}`;

     res.json("parsedClientData")

  
  } catch (err) {
    res.json(err.message)
  }


})













module.exports = router;