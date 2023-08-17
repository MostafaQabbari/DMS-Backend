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

        let resData = [];

        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                console.log(cases.cases[i].startDate)
                const currentDate = new Date();
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(currentDate.getDate() - 900);
                if (new Date(cases.cases[i].startDate) >= thirtyDaysAgo && new Date(cases.cases[i].startDate) <= currentDate) {
                    let resDataobj = {}
                    resDataobj.startDate = cases.cases[i].startDate;
                    resDataobj.reference = cases.cases[i].Reference;
                    console.log(cases.cases[i].mediationRecords)
                    // resDataobj.client1Name = `${cases.cases[i].MajorDataC1.fName} ${cases.cases[i].MajorDataC1.sName}`;
                    // resDataobj.client2Name =`${cases.cases[i].MajorDataC2.fName} ${cases.cases[i].MajorDataC2.sName}`;
                    // resDataobj.client1CaseType = cases.cases[i].caseTypeC1;
                    // resDataobj.client2CaseType = cases.cases[i].caseTypeC2;


                    // let medData = await Case.findById(cases.cases[i]._id).populate('connectionData.mediatorID');
                    // resDataobj.mediatorName = `${medData.connectionData.mediatorID.firstName} ${medData.connectionData.mediatorID.lastName}`;

                    for (let x = 0; i < cases.cases[i].mediationRecords.length; x++) {
                        let mediationSessionData = JSON.parse(cases.cases[x].mediationRecords[x]);


                        resDataobj.client1Name = mediationSessionData.clientData.clientOneFullName;
                        resDataobj.client2Name = mediationSessionData.clientData.clientTwoFullName;
                        resDataobj.mediatorName = mediationSessionData.mediatorName;

                        resDataobj.client1CaseType = cases.cases[i].caseTypeC1;
                        resDataobj.client2CaseType = cases.cases[i].caseTypeC2;
                        resDataobj.caseType = mediationSessionData.clientData.caseType;


                        resDataobj.mediationSessionNumber = mediationSessionData.clientData.mediationSessionNumber;
                        resDataobj.sessionLength = mediationSessionData.clientData.sessionLength;
                        resDataobj.mediationType = mediationSessionData.recordOfMattersDiscussed.mediationType;

                        resDataobj.dateToReturnMediation = mediationSessionData.NextSteps.returnToMediationDate;

                        console.log("📢📢")


                    }


                    resData.push(resDataobj)
                }

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
