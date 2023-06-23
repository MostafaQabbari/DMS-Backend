const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const dateNow = require("../global/dateNow")





router.patch("/C2_invitation/:id", async (req, res) => {


  try {

    let currentCase = await Case.findById(req.params.id);
    let C2invitation = req.body;
    let statusRemider = {
      reminderID: `${currentCase._id}-statusRemider`,
      reminderTitle: `${currentCase.Reference}-Invitation to C2 sent`,
      startDate: dateNow()
    }
    
    //currentCase.status == "MIAM Part 2-C1" && !currentCase.C2invitationApplied
    if (true) {

      let MajorDataC2 = {
        fName: C2invitation.firstName,
        sName: C2invitation.surName,
        mail: C2invitation.C2mail,
        phoneNumber: C2invitation.phoneNumber
      }
      let Reference = `${currentCase.MajorDataC1.sName}& ${ C2invitation.surName}`;
     // console.log(Reference)


      const StringfyData = JSON.stringify(C2invitation)

     // console.log(StringfyData)

    const updatedCase=   await Case.findByIdAndUpdate(req.params.id, {
        $set: {
          'MajorDataC2.fName': MajorDataC2.fName,
          'MajorDataC2.sName': MajorDataC2.sName,
          'MajorDataC2.mail': MajorDataC2.mail,
          'MajorDataC2.phoneNumber': MajorDataC2.phoneNumber,
          'Reminders.statusRemider': statusRemider
        }, C2invitation: StringfyData, C2invitationApplied: true,Reference, status: "Invitation to C2 sent"
      })


      const companyData = await Case.findById(req.params.id).populate('connectionData.companyID');
      const companyEmail = companyData.connectionData.companyID.email;
      const medData = await Case.findById(req.params.id).populate('connectionData.mediatorID');
      const medEmail = medData.connectionData.mediatorID.email;
      //mediatorData.name = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;
      //  mediatorData.email = medEmail
      // messageBodyinfo.formUrl = `${config.baseUrlMIAM2}/${config.MIAM_PART_2}/${updatedCase._id}`;



      res.json({ "res": "C2 invitation form has been applies" })
    }
    else {
      res.json({ "res": "this case has been applied before or not suitable please check it out" })
    }









  } catch (err) {
    res.json(err.message)
  }


})













module.exports = router;