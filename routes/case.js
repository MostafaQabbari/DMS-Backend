const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");
const nodemailer = require("nodemailer")
const decryptTwillioData = require('../middleware/getDataFromTwilio');
const config = require("../config/config");



router.post('/creatCase', authMiddleware, async (req, res, next) => {

  let companyData = {};
  let clientData = {};
  let messageBodyinfo = {};

  try {
    if (req.userRole == 'company') {
      const { firstName, surName, phoneNumber, email, dateOfMAIM, location, mediatorMail } = req.body;
      const Themediator = await mediator.findOne({ email: mediatorMail });
      const companyId = req.user._id;


      //console.log("theMed",Themediator);
      console.log("body", req.body);

      let newCaseID;
      // if (Themediator) {

      console.log("mMail", mediatorMail)
      let newCase = await Case.insertMany(
        {
          client1ContactDetails: { firstName, surName, phoneNumber, email, dateOfMAIM, location },
          connectionData: { companyID: req.user._id, mediatorID: Themediator._id }
        });
      console.log(newCase)
      newCaseID = newCase[0]._id
      // Update the company's cases array with the new case ID
      await Company.findByIdAndUpdate(companyId, { $push: { cases: newCase[0]._id } });
      await mediator.findByIdAndUpdate(Themediator._id, { $push: { cases: newCase[0]._id } });

      clientData.email = email;
      clientData.clientName = `${newCase[0].client1ContactDetails.firstName} ${newCase[0].client1ContactDetails.surName}`;
      messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1_client1}/${newCase[0]._id}`;
      companyData.companyName = req.user.companyName;
      companyData.email = req.user.email;
      sendMail(companyData, clientData, messageBodyinfo)

      // }
      // else{
      //   res.json({"message" : "please add the mediator first"})
      // }

      res.json({ caseID: newCaseID })
    }

    else if (req.userRole == 'mediator') {
      const { firstName, surName, phoneNumber, email, dateOfMAIM, location } = req.body;
      const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');

      let newCase = await Case.insertMany(
        {
          client1ContactDetails: { firstName, surName, phoneNumber, email, dateOfMAIM, location },
          connectionData: { mediatorID: req.user._id, companyID: mediatorCompanyData.companyId._id }
        });

      // Update the company's cases array with the new case ID
      const compID = mediatorCompanyData.companyId._id;
      const medID = req.user._id
      await Company.findByIdAndUpdate(compID, { $push: { cases: newCase[0]._id } });
      await mediator.findByIdAndUpdate(medID, { $push: { cases: newCase[0]._id } });

      clientData.email = email;
      clientData.clientName = `${newCase[0].client1ContactDetails.firstName} ${newCase[0].client1ContactDetails.surName}`;
      messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1_client1}/${newCase[0]._id}`;

      companyData.companyName = mediatorCompanyData.companyId.companyName
      companyData.email = mediatorCompanyData.companyId.email
      sendMail(companyData, clientData, messageBodyinfo)
      // console.log(newCase[0])
      res.json({ caseID: newCase[0]._id })
    }

    else {
      res.json({ 'message': "error in the role of token" })
    }
  } catch (err) {
    res.json({ message: err.message })
  }

});




router.get('/getCasesList', authMiddleware, async (req, res) => {

  let client1data, Reference, startDate, tempRefDummyData, MIAM2mediator
  let resposedCaseObj, casesList = [];
  let tempDate

  try {
    if (req.userRole == "company") {

      let cases = await Company.findById(req.user._id).populate('cases');
      for (let i = 0; i < cases.cases.length; i++) {

        resposedCaseObj = {
          _id: cases.cases[i]._id,
          Reference: cases.cases[i].Reference,
          status:cases.cases[i].status,
          startDate:  cases.cases[i].startDate,
        }

        casesList.push(resposedCaseObj)

      }
     

      res.json(casesList)

    }
    else if (req.userRole == "mediator") {


      let cases = await mediator.findById(req.user._id).populate('cases');

      for (let i = 0; i < cases.cases.length; i++) {

        resposedCaseObj = {
          _id: cases.cases[i]._id,
          Reference: cases.cases[i].Reference,
          status:cases.cases[i].status,
          startDate:  cases.cases[i].startDate,
        }

        casesList.push(resposedCaseObj)

      }


      res.json(casesList)

    }
    else {
      res.json("error with auth role ")
    }
  } catch (err) {
    res.json(err.message)
  }


})




router.get('/getCasesDetails/:id', authMiddleware, async (req, res) => {

  let CaseFound, CaseResponse, MIAM1_C1, MIAM1_C2, MIAM2_C1, MIAM2_C2
  //let Reference , client1ContactDetails , client1data , MIAM2mediator , client2data , MIAM2C2;



  try {

    if (req.userRole == "company") {

      let cases = await Company.findById(req.user._id).populate('cases');

      for (let i = 0; i < cases.cases.length; i++) {
        if (cases.cases[i]._id == req.params.id) {

          CaseFound = (cases.cases[i])
        }
      }
      if (CaseFound) {
        if (CaseFound.client1data) MIAM1_C1 = JSON.parse(CaseFound.client1data); else MIAM1_C1 = "Data didn't added yet"
        if (CaseFound.MIAM2mediator) MIAM2_C1 = JSON.parse(CaseFound.MIAM2mediator); else MIAM2_C1 = "Data didn't added yet"
        if (CaseFound.client2data) MIAM1_C2 = JSON.parse(CaseFound.client2data); else MIAM1_C2 = "Data didn't added yet"
        if (CaseFound.MIAM2C2) MIAM2_C2 = JSON.parse(CaseFound.MIAM2C2); else MIAM2_C2 = "Data didn't added yet"


        CaseResponse = {
          Reference: CaseFound.Reference,
          client1ContactDetails: CaseFound.client1ContactDetails,
          startDate:CaseFound.startDate,
          status: CaseFound.status,
          closed: CaseFound.closed,
          MIAM1_C1,
          MIAM2_C1,
          MIAM1_C2,
          MIAM2_C2,
        }

        res.json(CaseResponse)
      }
      else {
        res.json(" you don't have the access on this case ")
      }

    }
    else if (req.userRole == "mediator") {

      let cases = await mediator.findById(req.user._id).populate('cases');

      for (let i = 0; i < cases.cases.length; i++) {
        if (cases.cases[i]._id == req.params.id) {

          CaseFound = (cases.cases[i])
        }
      }
      if (CaseFound) {
        if (CaseFound.client1data) MIAM1_C1 = JSON.parse(CaseFound.client1data); else MIAM1_C1 = "Data didn't added yet"
        if (CaseFound.MIAM2mediator) MIAM2_C1 = JSON.parse(CaseFound.MIAM2mediator); else MIAM2_C1 = "Data didn't added yet"
        if (CaseFound.client2data) MIAM1_C2 = JSON.parse(CaseFound.client2data); else MIAM1_C2 = "Data didn't added yet"
        if (CaseFound.MIAM2C2) MIAM2_C2 = JSON.parse(CaseFound.MIAM2C2); else MIAM2_C2 = "Data didn't added yet"


        CaseResponse = {
          Reference: CaseFound.Reference,
          client1ContactDetails: CaseFound.client1ContactDetails,
          startDate:CaseFound.startDate,
          status: CaseFound.status,
          closed: CaseFound.closed,
          MIAM1_C1,
          MIAM2_C1,
          MIAM1_C2,
          MIAM2_C2,
        }

        res.json(CaseResponse)
      }
      else {
        res.json(" you don't have the access on this case ")
      }
    }
    else {
      res.json("err with user Auth")
    }

  } catch (err) {
    res.json(err.message)
  }


})


router.patch("/configureDummy", authMiddleware, async (req, res) => {

  // let cases = await Company.findById(req.user._id).populate('cases');


  // let meds = await Company.findById(req.user._id).populate('mediators');
  //meds.cases=[]
  for (let i = 0; i < meds.mediators.length; i++) {
    //   await mediator.findByIdAndUpdate(meds.mediators[i]._id, { cases: [] })

    //  console.log(meds.mediators)

  }

  for (let i = 0; i < cases.cases.length; i++) {
    // await Case.findByIdAndRemove(cases.cases[i]._id);
    // await Company.findByIdAndUpdate(req.user._id,{cases:[]})
    // let meds = await Company.findById(req.user._id).populate('mediators');
    //   console.log(meds)




    // if (!cases.cases[i]._id.Reference && cases.cases[i]._id.Reference!="Data didn't added yet " || cases.cases[i]._id.Reference!= "{Data didn't added yet} ") {
    //   console.log(cases.cases[i])
    //   if(cases.cases[i].client1data &&  cases.cases[i].client1data!="Data didn't added yet " || cases.cases[i].client1data!= "{Data didn't added yet} ")
    //   {
    //     client1data = JSON.parse(cases.cases[i].client1data);
    //     if (cases.cases[i].MIAM2mediator && cases.cases[i].MIAM2mediator!="Data didn't added yet " || cases.cases[i].MIAM2mediator!="{Data didn't added yet} ") {

    //         MIAM2mediator = JSON.parse(cases.cases[i].MIAM2mediator);
    //         tempDate = MIAM2mediator.mediationDetails.DateOfMIAM;
    //         if (tempDate) tempDate = tempDate.slice(0, 10);
    //         else tempDate = "2020-05-13"
    //     }
    //     tempRefDummyData = `${client1data.personalContactAndCaseInfo.surName} & ${client1data.otherParty.otherPartySurname}`
    //   }

    //   await Case.findByIdAndUpdate(cases.cases[i]._id, {
    //     status: "C2 MIAM Part 2 Applied",
    //     Reference: tempRefDummyData,
    //     startDate: tempDate

    //   })
    // }


  }
  res.json("Xxxx")


})

module.exports = router;


