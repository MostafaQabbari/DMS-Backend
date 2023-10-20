const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");
const nodemailer = require("nodemailer")
const decryptTwillioData = require('../middleware/getDataFromTwilio');
const config = require("../config/config");
const dateNow = require("../global/dateNow")
const fs = require('fs');
const { PDFDocument } = require("pdf-lib");
const path = require('path');
const { stringify } = require('querystring');
const { google } = require("googleapis");
const stream = require("stream");

const notifyCompany = function (compMail, clientDataName) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        starttls: {
            enable: true
        },
        starttls: {
            enable: true
        },

        secureConnection: false,

        auth: {
            user: config.companyEmail,
            pass: config.appPassWord,
        },

    })

    let info = transporter.sendMail({
        from: config.companyEmail,
        to: compMail,
        subject: `Legal Aid form has for applied for ${clientDataName} `,
        html: `<body>
        <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
        <h3>We love to inform you that Legal Aid form has been applied for ${clientDataName}</h3>
        <p> Best Regards </p>
        <p>DMS's Team </p> 
        </div>
        </body>`,

    });

}

const sendMailMIAM1 = function (companyData, clientData, messageBodyinfo) {
    /*
 
   companyData ={companyName , email}
   clientData = {clientName ,email}
   messageBodyinfo = {formUrl}
 
  */
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        starttls: {
            enable: true
        },
        starttls: {
            enable: true
        },

        secureConnection: false,

        auth: {
            user: config.companyEmail,
            pass: config.appPassWord,
        },

    })


    let info = transporter.sendMail({
        from: config.companyEmail,
        to: clientData.email,
        subject: `Applying To ${messageBodyinfo.formType} Form`,
        html: ` <div style="background-color: #72A0C1 ; text-align: center; padding: 5vw; width: 75%; margin: auto;">
       <h1>Dear ${clientData.clientName}  </h1>
      <p> Thanks for booking you MIAM . BEFORE your Mediation information & Assessment Meeting (MIAM) with one of our family mediators ,
       we need you to complete an online form records basic information about you and your situation. </p>
       <p> Please click on the link below :</p>
      <a href='${messageBodyinfo.formUrl}'  style="  padding:5px;"> ${messageBodyinfo.formUrl} </a>
      <h3>Direct Mediation Services</h3>
      <h4>${companyData.companyName}</h4>
      <h4>${companyData.email}</h4>
       </div>`


    });


    transporter.sendMail(info, (error, info) => {
        if (error) {
            console.log('Error occurred while sending email:', error.message);

        } else {
            console.log('Email sent successfully:', info.messageId);
        }
    });

}


router.patch("/passporting_c1/:id", async (req, res) => {


    try {

        let currentCase = await Case.findById(req.params.id);
        let passporting_C1 = req.body
        const StringfyData = JSON.stringify(passporting_C1);
        const reference = currentCase.Reference;
        const folderId = currentCase.folderID;
        updateFolderName(folderId, reference);

        let LAtabelObj={
            clientType:"C1",
            firstName:passporting_C1.personalDetails.firstName,
            sureName:passporting_C1.personalDetails.surname,
            typeOfApplication:"Passporting",
            status:"Application received",
            DoB:passporting_C1.personalDetails.dateOfBirth,
            postCode:passporting_C1.personalDetails.address.postcode,
            phoneNo:passporting_C1.personalDetails.telephoneNumber,
            email:passporting_C1.personalDetails.emailAddress,
            address:`${passporting_C1.personalDetails.address.street}, ${passporting_C1.personalDetails.address.city}, ${passporting_C1.personalDetails.address.country} `,
            howFoundUs:passporting_C1.personalDetails.findDMS,
            surNameOftheOtherPerson:passporting_C1.previousRelationshipDetails.otherPersonSurname
          }





        //!currentCase.passporting_C1
        if (true) {

            await Case.findByIdAndUpdate(req.params.id, {
                passporting_C1: StringfyData ,
                $set: {

                    'legalAidTableData.C1': JSON.stringify(LAtabelObj)
      
                  },
            })

            let companyData = {}, clientData = {}, messageBodyinfo = {}

            const currentComp = await Case.findById(currentCase._id).populate('connectionData.companyID');
            companyData.email = currentComp.connectionData.companyID.email;
            companyData.companyName = currentComp.connectionData.companyID.companyName;
            sharingGmail = currentComp.connectionData.companyID.sharingGmail;

            await createLegalAidPassport(passporting_C1, reference, currentCase._id, sharingGmail);

            const updatedCase = await Case.findById(req.params.id);
            clientData.clientName = `${updatedCase.MajorDataC1.fName} ${updatedCase.MajorDataC1.sName}`
            clientData.email = updatedCase.MajorDataC1.mail

            messageBodyinfo.formType = "MIAM 1"
            messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/${req.params.id}`;
            sendMailMIAM1(companyData, clientData, messageBodyinfo);
            notifyCompany(companyData.email, clientData.clientName)

            res.status(200).json({ "message": "Passporting form for C1 has been added" })

        }
        else {
            res.status(400).json({ "message": "this from has been applied before" })

        }


    } catch (err) {
        res.status(400).json(err.message)
    }


});

router.patch("/lowIncome_c1/:id", async (req, res) => {


    try {

        let currentCase = await Case.findById(req.params.id);
        let lowIncome_C1 = req.body
        const StringfyData = JSON.stringify(lowIncome_C1);
        const reference = currentCase.Reference;
        const folderId = currentCase.folderID;
        updateFolderName(folderId, reference);
        //!!!!!! لسة هبدء مع ال low income
        let LAtabelObj={
            clientType:"C1",
            firstName:lowIncome_C1.personalDetails.firstName,
            sureName:lowIncome_C1.personalDetails.surname,
            typeOfApplication:"Low Income / No Income",
            status:"Application received",
            DoB:lowIncome_C1.personalDetails.dateOfBirth,
            postCode:lowIncome_C1.personalDetails.address.postcode,
            phoneNo:lowIncome_C1.personalDetails.telephoneNumber,
            email:lowIncome_C1.personalDetails.emailAddress,
            address:`${lowIncome_C1.personalDetails.address.street}, ${lowIncome_C1.personalDetails.address.city}, ${lowIncome_C1.personalDetails.address.country} `,
            howFoundUs:lowIncome_C1.personalDetails.findDMS,
            surNameOftheOtherPerson:lowIncome_C1.previousRelationshipDetails.otherPersonSurname
          }

        // try {
        //     const filledPdfBytes = await createLegalAidLowIncome(lowIncome_C1 , reference);
        //     await fs.promises.writeFile('legalAidLowIncomeC1.pdf', filledPdfBytes);
        //     console.log('PDF form filled and saved.');
        //     } catch (error) {
        //     console.error('Error:', error);
        //     }



        // !currentCase.lowIncome_C1
        if (true) {

            await Case.findByIdAndUpdate(req.params.id, {
                lowIncome_C1: StringfyData,
                $set: {

                    'legalAidTableData.C1': JSON.stringify(LAtabelObj)
      
                  },
            })

            let companyData = {}, clientData = {}, messageBodyinfo = {}

            const currentComp = await Case.findById(currentCase._id).populate('connectionData.companyID');
            companyData.email = currentComp.connectionData.companyID.email;
            companyData.companyName = currentComp.connectionData.companyID.companyName;
            sharingGmail = currentComp.connectionData.companyID.sharingGmail;

            await createLegalAidLowIncome(lowIncome_C1, reference, currentCase._id, sharingGmail);
            const updatedCase = await Case.findById(req.params.id);
            clientData.clientName = `${updatedCase.MajorDataC1.fName} ${updatedCase.MajorDataC1.sName}`
            clientData.email = updatedCase.MajorDataC1.mail

            messageBodyinfo.formType = "MIAM 1"
            messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/${req.params.id}`;
            sendMailMIAM1(companyData, clientData, messageBodyinfo);
            notifyCompany(companyData.email, clientData.clientName)

            res.status(200).json({ "message": "LowIncome form for C1 has been added" })

        }
        else {
            res.status(400).json({ "message": "this from has been applied before" })

        }
    } catch (err) {
        res.status(400).json(err.message)
    }


});




router.patch("/passporting_c2/:id", async (req, res) => {


    try {

        let currentCase = await Case.findById(req.params.id);
        let passporting_C2 = req.body
        const StringfyData = JSON.stringify(passporting_C2);
        const reference = currentCase.Reference;
        let LAtabelObj={
            clientType:"C2",
            firstName:passporting_C2.personalDetails.firstName,
            sureName:passporting_C2.personalDetails.surname,
            typeOfApplication:"Passporting",
            status:"Application received",
            DoB:passporting_C2.personalDetails.dateOfBirth,
            postCode:passporting_C2.personalDetails.address.postcode,
            phoneNo:passporting_C2.personalDetails.telephoneNumber,
            email:passporting_C2.personalDetails.emailAddress,
            address:`${passporting_C2.personalDetails.address.street}, ${passporting_C2.personalDetails.address.city}, ${passporting_C2.personalDetails.address.country} `,
            howFoundUs:passporting_C2.personalDetails.findDMS,
            surNameOftheOtherPerson:passporting_C2.previousRelationshipDetails.otherPersonSurname
          }



        // try {
        // const filledPdfBytes = await createLegalAidPassport(passporting_C2 , reference);
        // await fs.promises.writeFile('legalAidPassportC2.pdf', filledPdfBytes);
        // console.log('PDF form filled and saved.');
        // } catch (error) {
        // console.error('Error:', error);
        // }

        //!currentCase.passporting_C2
        if (true) {

            await Case.findByIdAndUpdate(req.params.id, {
                passporting_C2: StringfyData,
                $set: {

                    'legalAidTableData.C2': JSON.stringify(LAtabelObj)
      
                  },
            })

            let companyData = {}, clientData = {}, messageBodyinfo = {}

            const currentComp = await Case.findById(currentCase._id).populate('connectionData.companyID');
            companyData.email = currentComp.connectionData.companyID.email;
            companyData.companyName = currentComp.connectionData.companyID.companyName;
            sharingGmail = currentComp.connectionData.companyID.sharingGmail;

            await createLegalAidPassport(passporting_C2, reference, currentCase._id, sharingGmail);

            const updatedCase = await Case.findById(req.params.id);
            clientData.clientName = `${updatedCase.MajorDataC2.fName} ${updatedCase.MajorDataC2.sName}`
            clientData.email = updatedCase.MajorDataC2.mail

            messageBodyinfo.formType = "MIAM 1"
            messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/${req.params.id}`;
            sendMailMIAM1(companyData, clientData, messageBodyinfo);
            notifyCompany(companyData.email, clientData.clientName)

            res.status(200).json({ "message": "Passporting form for C2 has been added" })

        }
        else {
            res.status(400).json({ "message": "this from has been applied before" })

        }
    } catch (err) {
        res.status(400).json(err.message)
    }


});
router.patch("/lowIncome_c2/:id", async (req, res) => {


    try {

        let currentCase = await Case.findById(req.params.id);
        let lowIncome_C2 = req.body
        const StringfyData = JSON.stringify(lowIncome_C2);
        const reference = currentCase.Reference;
        let LAtabelObj={
            clientType:"C1",
            firstName:lowIncome_C2.personalDetails.firstName,
            sureName:lowIncome_C2.personalDetails.surname,
            typeOfApplication:"Low Income / No Income",
            status:"Application received",
            DoB:lowIncome_C2.personalDetails.dateOfBirth,
            postCode:lowIncome_C2.personalDetails.address.postcode,
            phoneNo:lowIncome_C2.personalDetails.telephoneNumber,
            email:lowIncome_C2.personalDetails.emailAddress,
            address:`${lowIncome_C2.personalDetails.address.street}, ${lowIncome_C2.personalDetails.address.city}, ${lowIncome_C2.personalDetails.address.country} `,
            howFoundUs:lowIncome_C2.personalDetails.findDMS,
            surNameOftheOtherPerson:lowIncome_C2.previousRelationshipDetails.otherPersonSurname
          }



        // try {
        //     const filledPdfBytes = await createLegalAidLowIncome(lowIncome_C2 , reference);
        //     await fs.promises.writeFile('legalAidLowIncomeC2.pdf', filledPdfBytes);
        //     console.log('PDF form filled and saved.');
        //     } catch (error) {
        //     console.error('Error:', error);
        //     }




        //!currentCase.lowIncome_C2
        if (true) {

            await Case.findByIdAndUpdate(req.params.id, {
                lowIncome_C2: StringfyData,
                $set: {

                    'legalAidTableData.C2': JSON.stringify(LAtabelObj)
      
                  },
            })

            let companyData = {}, clientData = {}, messageBodyinfo = {}

            const currentComp = await Case.findById(currentCase._id).populate('connectionData.companyID');
            companyData.email = currentComp.connectionData.companyID.email;
            companyData.companyName = currentComp.connectionData.companyID.companyName;
            sharingGmail = currentComp.connectionData.companyID.sharingGmail;

            await createLegalAidLowIncome(lowIncome_C2, reference, currentCase._id, sharingGmail);
            const updatedCase = await Case.findById(req.params.id);
            clientData.clientName = `${updatedCase.MajorDataC2.fName} ${updatedCase.MajorDataC2.sName}`
            clientData.email = updatedCase.MajorDataC2.mail

            messageBodyinfo.formType = "MIAM 1"
            messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/${req.params.id}`;
            sendMailMIAM1(companyData, clientData, messageBodyinfo);
            notifyCompany(companyData.email, clientData.clientName)

            res.status(200).json({ "message": "Low income form for C2 has been added" })

        }
        else {
            res.status(400).json({ "message": "this from has been applied before" })

        }
    } catch (err) {
        res.status(400).json(err.message)
    }


});


async function createLegalAidPassport(fieldData, reference, caseID, sharingGmail) {
    try {

        const filePath = path.resolve(__dirname, '../uploads/pdfs/Legal-Aid.pdf');
        const pdfBytes = await fs.promises.readFile(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();

        const personalDetails = fieldData.personalDetails;

        // Set personal details
        form.getTextField('FillText1').setText(reference); // Get from the database
        form.getTextField('FillText2').setText(personalDetails?.surname);
        form.getTextField('FillText4').setText(personalDetails?.firstName);
        form.getTextField('FillText3').setText(personalDetails?.differentSurnameAtBirth);

        const dateOfBirth = personalDetails?.dateOfBirth;
        const [year, month, day] = dateOfBirth.split('-');
        form.getTextField('Comb3').setText(day);
        form.getTextField('Comb31').setText(month);
        form.getTextField('Comb2').setText(year);

        form.getTextField('FillText9').setText(personalDetails.address.street);
        form.getTextField('FillText19').setText("6"); // Add the rest of the address data
        form.getTextField('FillText20').setText(personalDetails.address.postcode);

        form.getTextField('FillText8').setText("In employment");

        // Set National Insurance number into separate fields
        const niNumber = fieldData.personalDetails.nationalInsuranceNumber;
        const niNumberWithoutSpaces = niNumber.replace(/\s+/g, ''); // Removes all spaces
        ['Comb1', 'Comb11', 'Comb4', 'Comb5', 'Comb6', 'Comb7', 'Comb8', 'Comb9', 'Comb10']
            .forEach((fieldName, index) => form.getTextField(fieldName).setText(niNumberWithoutSpaces[index]));

        // Set checkbox for age below 18
        const result = isAgeBelow18(dateOfBirth);
        const checkboxField1 = form.getField('Client is under 18');
        checkboxField1[result === 'Yes' ? 'check' : 'uncheck']();

        // Set checkbox for cohabiting or married
        const checkboxField2 = form.getField('Partner');
        const isCohabitingOrMarried = personalDetails.maritalStatus;
        const shouldCheckCohabitingOrMarried = isCohabitingOrMarried === "Cohabiting with new partner" || isCohabitingOrMarried === "Married to a new partner";
        checkboxField2[shouldCheckCohabitingOrMarried ? 'check' : 'uncheck']();

        // Set properties and assets
        const properties1 = fieldData?.properties[0];
        const properties2 = fieldData?.properties[1];
        const assets = fieldData.assets;
        const isOwnproperty = fieldData.accommodation.ownProperty;
        const checkboxField3 = form.getField('Case is about ownership or possession of assets');
        const caseAbout = fieldData.case.caseAbout;
        const share = properties1?.propertyShare
        const value1 = properties1?.propertyWorth;
        const value2 = properties1?.outstandingMortgageProperty;
        const theDifference = value1 - value2;
        const shareDecimalValue = parseFloat(share) / 100;
        const result5 = theDifference * shareDecimalValue;
        const theDifferenceString = theDifference.toString();
        const result5String = result5.toString();

        const shareOther = properties2?.propertyShare
        const value1Other = properties2?.propertyWorth;
        const value2Other = properties2?.outstandingMortgageProperty;
        const theDifferenceOther = value1Other - value2Other;
        const shareDecimalValueOther = parseFloat(shareOther) / 100;
        const result5Other = theDifferenceOther * shareDecimalValueOther;
        const theDifferenceStringOther = theDifferenceOther.toString();
        const result5StringOther = result5Other.toString();

        //PartA ElseIF PartB
        if (caseAbout == "Financial Arrangements" || caseAbout == "Both") {
            checkboxField3.check();
            //Main home
            form.getTextField('FillText105').setText(properties1?.propertyWorth);
            form.getTextField('FillText106').setText(properties1?.outstandingMortgageProperty);
            // form.get('SMOD Main home held in joint names with opponent').setText(properties.isPropertyInJointNamesWithYourEx-partner);
            const checkboxField4 = await form.getField('SMOD Main home held in joint names with opponent');
            const isJointNames = properties1?.isPropertyInJointNamesWithYourExpartner;

            if (isJointNames == "Yes") {
                checkboxField4.check();
            } else if (isJointNames == "no") {
                checkboxField4.uncheck();
            }
            form.getTextField('FillText21').setText(share);
            form.getTextField('FillText102').setText(theDifferenceString);
            form.getTextField('FillText80').setText(result5String);
            //Other property
            form.getTextField('FillText107').setText(properties2?.propertyWorth);
            form.getTextField('FillText108').setText(properties2?.outstandingMortgageProperty);
            const checkboxField5 = await form.getField('SMOD other property held in joint names with opponent');
            const isJointNamesOtherProperties = properties2?.isPropertyInJointNamesWithYourExpartner;

            if (isJointNamesOtherProperties == "Yes") {
                checkboxField5.check();
            } else if (isJointNamesOtherProperties == "no") {
                checkboxField5.uncheck();
            }
            form.getTextField('FillText23').setText(shareOther);
            form.getTextField('FillText103').setText(theDifferenceStringOther);
            form.getTextField('FillText97').setText(result5StringOther);
            //PartA point 7
            form.getTextField('FillText24').setText(assets.backAccountSavingAmount);
            form.getTextField('FillText25').setText(assets.investmentsAmount);
            form.getTextField('FillText55').setText(assets.valuableItemsAmount);
            const otherCapitalnumber = parseFloat(assets.pensionsValue) + parseFloat(assets.otherPartyPensionValue);
            const otherCapitalString = otherCapitalnumber.toString();
            form.getTextField('FillText67').setText(otherCapitalString);
            const totalCapitalNumber = parseFloat(assets.backAccountSavingAmount) + parseFloat(assets.investmentsAmount) + parseFloat(assets.valuableItemsAmount) + otherCapitalnumber;
            const totalCapitalString = totalCapitalNumber.toString();
            form.getTextField('FillText101').setText(totalCapitalString);

        } else if (caseAbout == 'Child Arrangements' && isOwnproperty == 'Yes') {
            //PartB
            checkboxField3.uncheck();
            //Main home
            form.getTextField('FillText56').setText(properties1?.propertyWorth);
            form.getTextField('FillText57').setText(properties1?.outstandingMortgageProperty);
            // form.get('SMOD Main home held in joint names with opponent').setText(properties.isPropertyInJointNamesWithYourEx-partner);
            const checkboxField4 = await form.getField('Main home held in joint names with opponent');
            const isJointNames = properties1?.isPropertyInJointNamesWithYourExpartner;

            if (isJointNames == "Yes") {
                checkboxField4.check();
            } else if (isJointNames == "no") {
                checkboxField4.uncheck();
            }
            form.getTextField('FillText60').setText(share);
            form.getTextField('FillText26').setText(theDifferenceString);
            form.getTextField('FillText36').setText(result5String);
            //Other property
            form.getTextField('FillText58').setText(properties2?.propertyWorth);
            form.getTextField('FillText59').setText(properties2?.outstandingMortgageProperty);
            const checkboxField5 = await form.getField('Other property held in joint names with opponent');
            const isJointNamesOtherProperties = properties2?.isPropertyInJointNamesWithYourExpartner;

            if (isJointNamesOtherProperties == "Yes") {
                checkboxField5.check();
            } else if (isJointNamesOtherProperties == "no") {
                checkboxField5.uncheck();
            }
            form.getTextField('FillText62').setText(shareOther);
            form.getTextField('FillText261').setText(theDifferenceStringOther);
            form.getTextField('FillText40').setText(result5StringOther);
            //PartB point 7 client
            const notIncludedInFinancialAssets = fieldData.notIncludedInFinancialAssets;
            form.getTextField('FillText110').setText(notIncludedInFinancialAssets?.savingsAmount);
            form.getTextField('FillText111').setText(notIncludedInFinancialAssets.investmentsAmount);
            form.getTextField('FillText112').setText(notIncludedInFinancialAssets.valuableItemsWorth);
            form.getTextField('FillText113').setText(notIncludedInFinancialAssets.otherCapitalValue);
            const totalCapitalNumber = parseFloat(notIncludedInFinancialAssets?.savingsAmount) + parseFloat(notIncludedInFinancialAssets.investmentsAmount) + parseFloat(notIncludedInFinancialAssets.valuableItemsWorth) + parseFloat(notIncludedInFinancialAssets.otherCapitalValue);
            const totalCapitalString = totalCapitalNumber.toString();
            form.getTextField('FillText118').setText(totalCapitalString);
            //PartB point 7 partner
            const partnerFinancialAssets = fieldData.partnerFinancialAssets;
            form.getTextField('FillText114').setText(partnerFinancialAssets?.savingsAmount);
            form.getTextField('FillText115').setText(partnerFinancialAssets.investmentsAmount);
            form.getTextField('FillText116').setText(partnerFinancialAssets.valuableItemsWorth);
            form.getTextField('FillText117').setText(partnerFinancialAssets.otherCapitalValue);

        }

        //Evidence given
        form.getField('Evidence given').check();



        const textField = form.getTextField('FillText35');
        if (fieldData.accommodation.accommodationLiveInType == 'Rent') {
            const newText = `THE APPLICANT IS IN RECEIPT OF ${fieldData.typeOfApplication.benefitReceiving}.\nTHE APPLICANT IS LIVING IN RENTED ACCOMMODATION IN A HOUSING ASSOCIATION. \nTHE APPLICANT IS ENTITLED TO LEGAL AID.`;
            textField.setText(newText);
        } else if (fieldData.accommodation.accommodationLiveInType == 'Own') {
            const newText = `THE APPLICANT IS IN RECEIPT OF ${fieldData.typeOfApplication.benefitReceiving}.\nTHE APPLICANT IS LIVING IN OWNED ACCOMMODATION \nTHE APPLICANT IS ENTITLED TO LEGAL AID.`;
            textField.setText(newText);
        } else if (fieldData.accommodation.accommodationLiveInType == 'I live with friend or family and I pay rent') {
            const newText = `THE APPLICANT IS IN RECEIPT OF ${fieldData.typeOfApplication.benefitReceiving}.\nTHE APPLICANT IS LIVING WITH A FRIEND OR FAMILY AND IS PAYING RENT. \nTHE APPLICANT IS ENTITLED TO LEGAL AID.`;
            textField.setText(newText);
        } else if (fieldData.accommodation.accommodationLiveInType == "I live with friend or family and don't pay rent") {
            const newText = `THE APPLICANT IS IN RECEIPT OF ${fieldData.typeOfApplication.benefitReceiving}.\nTHE APPLICANT IS LIVING WITH A FRIEND OR FAMILY AND IS NOT PAYING RENT. \nTHE APPLICANT IS ENTITLED TO LEGAL AID.`;
            textField.setText(newText);
        }

        // Set checkbox for Universal Credit
        if (fieldData.typeOfApplication.benefitReceiving.toUpperCase() === 'UNIVERSAL CREDIT') {
            form.getField('Passported').check();
        }

        const base64Signature = fieldData.clientDeclaration.signature;
        const imageBytes = Buffer.from(base64Signature, 'base64');
        const signaturePage = pdfDoc.getPage(6);


        try {
            const pdfImage = await pdfDoc.embedPng(imageBytes);

            const xPosition = 130;
            const yPosition = 620;

            signaturePage.drawImage(pdfImage, {
                x: xPosition,
                y: yPosition,
                width: 250,
                height: 40,
            });
        } catch (error) {
            console.error('Error embedding PNG image:', error);
        }

        // Set checkbox for mediator to complete
        if (caseAbout === 'Child Arrangements') {
            form.getField('CheckBox8').check();
        } else if (caseAbout === 'Financial Arrangements') {
            form.getField('CheckBox9').check();
        } else if (caseAbout === 'Both') {
            form.getField('CheckBox15').check();
        }

        if (fieldData.previousRelationshipDetails.isMarriedTo === 'Yes') {
            form.getField('Is person married to/have they ever been married to other party in didispute').check();
        }

        form.getField('CheckBox32').check();

        const modifiedPdfBytes = await pdfDoc.save();

        const auth = await google.auth.getClient({

            keyFile: config.credentialFile1,

            scopes: ['https://www.googleapis.com/auth/drive'], // Scopes required for accessing Google Drive
        });



        const drive = google.drive({ version: "v3", auth });

        const currentCase = await Case.findById(caseID);

        const folderId = currentCase.folderID;


        // Create a readable stream from the PDF bytes
        const readableStream = new stream.Readable({
            read() {
                this.push(modifiedPdfBytes);
                this.push(null);
            },
        });

        // Upload the PDF to the created folder
        const fileMetadata = {
            name: `"LegalAid-passport.pdf"`,
            parents: [folderId],
        };

        const media = {
            mimeType: "application/pdf",
            body: readableStream,
        };
        await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id",
        });

        shareWithPersonalAccount(folderId, sharingGmail);//the gmail sharing account that belong to the company
        //sharingGmail || "mkabary8@gmail.com" || "hassantarekha@gmail.com"
        console.log("PDF created and uploaded successfully");

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function createLegalAidLowIncome(fieldData, reference, caseID, sharingGmail) {
    try {
        const filePath = path.resolve(__dirname, '../uploads/pdfs/Legal-Aid.pdf');
        const pdfBytes = await fs.promises.readFile(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();

        const personalDetails = fieldData.personalDetails;

        // Set personal details
        form.getTextField('FillText1').setText(reference); // Get from the database
        form.getTextField('FillText2').setText(personalDetails?.surname);
        form.getTextField('FillText4').setText(personalDetails?.firstName);
        form.getTextField('FillText3').setText(personalDetails?.differentSurnameAtBirth);

        const dateOfBirth = personalDetails.dateOfBirth;
        const [year, month, day] = dateOfBirth.split('-');
        form.getTextField('Comb3').setText(day);
        form.getTextField('Comb31').setText(month);
        form.getTextField('Comb2').setText(year);

        form.getTextField('FillText9').setText(personalDetails?.address?.street);
        form.getTextField('FillText19').setText("6"); // Add the rest of the address data
        form.getTextField('FillText20').setText(personalDetails?.address?.postcode);

        form.getTextField('FillText8').setText("In employment");

        // Set National Insurance number into separate fields
        const niNumber = fieldData.personalDetails?.nationalInsuranceNumber;
        const niNumberWithoutSpaces = niNumber.replace(/\s+/g, ''); // Removes all spaces
        ['Comb1', 'Comb11', 'Comb4', 'Comb5', 'Comb6', 'Comb7', 'Comb8', 'Comb9', 'Comb10']
            .forEach((fieldName, index) => form.getTextField(fieldName).setText(niNumberWithoutSpaces[index]));

        // Set checkbox for age below 18
        const result = isAgeBelow18(dateOfBirth);
        const checkboxField1 = form.getField('Client is under 18');
        checkboxField1[result === 'Yes' ? 'check' : 'uncheck']();

        // Set checkbox for cohabiting or married
        const checkboxField2 = form.getField('Partner');
        const isCohabitingOrMarried = personalDetails.maritalStatus;
        const shouldCheckCohabitingOrMarried = isCohabitingOrMarried === "Cohabiting with new partner" || isCohabitingOrMarried === "Married to a new partner";
        checkboxField2[shouldCheckCohabitingOrMarried ? 'check' : 'uncheck']();

        // Set properties and assets
        const properties1 = fieldData.properties[0];
        const properties2 = fieldData.properties[1];
        const assets = fieldData.assets;
        const isOwnproperty = fieldData.case?.nameInDeedsProperty;
        const checkboxField3 = form.getField('Case is about ownership or possession of assets');
        const caseAbout = fieldData.case?.caseAbout;
        const share = properties1?.propertyShare
        const value1 = properties1?.propertyWorth;
        const value2 = properties1?.outstandingMortgageProperty;
        const theDifference = value1 - value2;
        const shareDecimalValue = parseFloat(share) / 100;
        const result5 = theDifference * shareDecimalValue;
        const theDifferenceString = theDifference.toString();
        const result5String = result5.toString();

        const shareOther = properties2?.propertyShare
        const value1Other = properties2?.propertyWorth;
        const value2Other = properties2?.outstandingMortgageProperty;
        const theDifferenceOther = value1Other - value2Other;
        const shareDecimalValueOther = parseFloat(shareOther) / 100;
        const result5Other = theDifferenceOther * shareDecimalValueOther;
        const theDifferenceStringOther = theDifferenceOther.toString();
        const result5StringOther = result5Other.toString();

        //PartA ElseIF PartB
        if (caseAbout == "Financial Arrangements" || caseAbout == "Both") {
            checkboxField3.check();
            //Main home
            form.getTextField('FillText105').setText(properties1?.propertyWorth);
            form.getTextField('FillText106').setText(properties1?.outstandingMortgageProperty);
            // form.get('SMOD Main home held in joint names with opponent').setText(properties.isPropertyInJointNamesWithYourEx-partner);
            const checkboxField4 = await form.getField('SMOD Main home held in joint names with opponent');
            const isJointNames = properties1?.isPropertyInJointNamesWithYourExpartner;

            if (isJointNames == "Yes") {
                checkboxField4.check();
            } else if (isJointNames == "no") {
                checkboxField4.uncheck();
            }
            form.getTextField('FillText21').setText(share);
            form.getTextField('FillText102').setText(theDifferenceString);
            form.getTextField('FillText80').setText(result5String);
            //Other property
            form.getTextField('FillText107').setText(properties2?.propertyWorth);
            form.getTextField('FillText108').setText(properties2?.outstandingMortgageProperty);
            const checkboxField5 = await form.getField('SMOD other property held in joint names with opponent');
            const isJointNamesOtherProperties = properties2?.isPropertyInJointNamesWithYourExpartner;

            if (isJointNamesOtherProperties == "Yes") {
                checkboxField5.check();
            } else if (isJointNamesOtherProperties == "no") {
                checkboxField5.uncheck();
            }
            form.getTextField('FillText23').setText(shareOther);
            form.getTextField('FillText103').setText(theDifferenceStringOther);
            form.getTextField('FillText97').setText(result5StringOther);
            //PartA point 7
            form.getTextField('FillText24').setText(assets?.backAccountSavingAmount);
            form.getTextField('FillText25').setText(assets?.investmentsAmount);
            form.getTextField('FillText55').setText(assets?.valuableItemsAmount);
            const otherCapitalnumber = parseFloat(assets?.pensionsValue) + parseFloat(assets?.otherPartyPensionValue);
            const otherCapitalString = otherCapitalnumber.toString();
            form.getTextField('FillText67').setText(otherCapitalString);
            const totalCapitalNumber = parseFloat(assets?.backAccountSavingAmount) + parseFloat(assets?.investmentsAmount) + parseFloat(assets?.valuableItemsAmount) + otherCapitalnumber;
            const totalCapitalString = totalCapitalNumber.toString();
            form.getTextField('FillText101').setText(totalCapitalString);

        } else if (caseAbout == 'Child Arrangements' && isOwnproperty == 'Yes') {
            //PartB
            checkboxField3.uncheck();
            //Main home
            form.getTextField('FillText56').setText(properties1?.propertyWorth);
            form.getTextField('FillText57').setText(properties1?.outstandingMortgageProperty);
            // form.get('SMOD Main home held in joint names with opponent').setText(properties.isPropertyInJointNamesWithYourEx-partner);
            const checkboxField4 = await form.getField('Main home held in joint names with opponent');
            const isJointNames = properties1?.isPropertyInJointNamesWithYourExpartner;

            if (isJointNames == "Yes") {
                checkboxField4.check();
            } else if (isJointNames == "no") {
                checkboxField4.uncheck();
            }
            form.getTextField('FillText60').setText(share);
            form.getTextField('FillText26').setText(theDifferenceString);
            form.getTextField('FillText36').setText(result5String);
            //Other property
            form.getTextField('FillText58').setText(properties2?.propertyWorth);
            form.getTextField('FillText59').setText(properties2?.outstandingMortgageProperty);
            const checkboxField5 = await form.getField('Other property held in joint names with opponent');
            const isJointNamesOtherProperties = properties2?.isPropertyInJointNamesWithYourExpartner;

            if (isJointNamesOtherProperties == "Yes") {
                checkboxField5.check();
            } else if (isJointNamesOtherProperties == "no") {
                checkboxField5.uncheck();
            }
            form.getTextField('FillText62').setText(shareOther);
            form.getTextField('FillText261').setText(theDifferenceStringOther);
            form.getTextField('FillText40').setText(result5StringOther);
            //PartB point 7 client
            const financialDetails = fieldData.financialDetails;
            form.getTextField('FillText110').setText(financialDetails?.savingsAmount);
            form.getTextField('FillText111').setText(financialDetails?.investmentsAmount);
            form.getTextField('FillText112').setText(financialDetails?.valuableItemsWorth);
            form.getTextField('FillText113').setText(financialDetails?.otherCapitalValue);
            const totalCapitalNumber = parseFloat(financialDetails?.savingsAmount) + parseFloat(financialDetails.investmentsAmount) + parseFloat(financialDetails.valuableItemsWorth) + parseFloat(financialDetails.otherCapitalValue);
            const totalCapitalString = totalCapitalNumber.toString();
            form.getTextField('FillText118').setText(totalCapitalString);
            //PartB point 7 partner
            const partnerFinancialAssets = fieldData.partnerFinancialAssets;
            form.getTextField('FillText114').setText(partnerFinancialAssets?.savingsAmount);
            form.getTextField('FillText115').setText(partnerFinancialAssets?.investmentsAmount);
            form.getTextField('FillText116').setText(partnerFinancialAssets?.valuableItemsWorth);
            form.getTextField('FillText117').setText(partnerFinancialAssets?.otherCapitalValue);

        }
        //PartC
        const otherDetails = fieldData.otherDetails;
        form.getTextField('FillText5').setText(otherDetails?.lastMonthMortgagePayment);
        form.getTextField('FillText7').setText(otherDetails?.lastMonthRentPay);
        const childernUnder15Number = parseFloat(otherDetails?.childrenUnder15) * 338.9;
        const childernUnder15String = childernUnder15Number.toString();
        const childernAbove16Number = parseFloat(otherDetails?.childrenOver15) * 338.9;
        const childernAbove16String = childernAbove16Number.toString();
        form.getTextField('FillText12').setText(childernUnder15String);
        form.getTextField('FillText13').setText(childernAbove16String);

        form.getTextField('FillText16').setText("45");
        form.getTextField('FillText18').setText(otherDetails?.lastMonthMaintenancePayment);
        form.getTextField('FillText27').setText(otherDetails?.lastMonthChildCarePayment);
        form.getTextField('FillText28').setText(otherDetails?.criminalLegalAidPerMonthPayment);



        //Evidence given
        form.getField('Evidence given').check();



        const textField = form.getTextField('FillText35');
        if (fieldData?.case?.accommodationType == 'Privately rented') {
            const newText = `THE APPLICANT IS IN RECEIPT OF LOW INCOME/SELF-EMPLOYED.\nTHE APPLICANT IS LIVING IN RENTED ACCOMMODATION IN A HOUSING ASSOCIATION. \nTHE APPLICANT IS ENTITLED TO LEGAL AID.`;
            textField.setText(newText);
        } else if (fieldData?.case?.accommodationType == 'My own property') {
            const newText = `THE APPLICANT IS IN RECEIPT OF LOW INCOME/SELF-EMPLOYED.\nTHE APPLICANT IS LIVING IN OWNED ACCOMMODATION \nTHE APPLICANT IS ENTITLED TO LEGAL AID.`;
            textField.setText(newText);
        } else if (fieldData?.case?.accommodationType == 'I live with friend or family and I pay rent') {
            const newText = `THE APPLICANT IS IN RECEIPT OF LOW INCOME/SELF-EMPLOYED.\nTHE APPLICANT IS LIVING WITH A FRIEND OR FAMILY AND IS PAYING RENT. \nTHE APPLICANT IS ENTITLED TO LEGAL AID.`;
            textField.setText(newText);
        } else if (fieldData?.case?.accommodationType == "I live with friend or family and I pay rent") {
            const newText = `THE APPLICANT IS IN RECEIPT OF LOW INCOME/SELF-EMPLOYED.\nTHE APPLICANT IS LIVING WITH A FRIEND OR FAMILY AND IS NOT PAYING RENT. \nTHE APPLICANT IS ENTITLED TO LEGAL AID.`;
            textField.setText(newText);
        }

        // // Set checkbox for Universal Credit
        // if (fieldData.typeOfApplication.benefitReceiving.toUpperCase() === 'UNIVERSAL CREDIT') {
        //     form.getField('Passported').check();
        // }



        const base64Signature = fieldData.clientDeclaration.signature;
        const imageBytes = Buffer.from(base64Signature, 'base64');
        const signaturePage = pdfDoc.getPage(6);


        try {
            const pdfImage = await pdfDoc.embedPng(imageBytes);

            const xPosition = 130;
            const yPosition = 620;

            signaturePage.drawImage(pdfImage, {
                x: xPosition,
                y: yPosition,
                width: 250,
                height: 40,
            });
        } catch (error) {
            console.error('Error embedding PNG image:', error);
        }

        // Set checkbox for mediator to complete
        if (caseAbout === 'Child Arrangements') {
            form.getField('CheckBox8').check();
        } else if (caseAbout === 'Financial Arrangements') {
            form.getField('CheckBox9').check();
        } else if (caseAbout === 'Both') {
            form.getField('CheckBox15').check();
        }

        if (fieldData.previousRelationshipDetails?.isMarriedTo === 'Yes') {
            form.getField('Is person married to/have they ever been married to other party in didispute').check();
        }

        form.getField('CheckBox32').check();

        const modifiedPdfBytes = await pdfDoc.save();


        const auth = await google.auth.getClient({

            keyFile: config.credentialFile1,

            scopes: ['https://www.googleapis.com/auth/drive'], // Scopes required for accessing Google Drive
        });



        const drive = google.drive({ version: "v3", auth });

        const currentCase = await Case.findById(caseID);

        const folderId = currentCase.folderID;


        // Create a readable stream from the PDF bytes
        const readableStream = new stream.Readable({
            read() {
                this.push(modifiedPdfBytes);
                this.push(null);
            },
        });

        // Upload the PDF to the created folder
        const fileMetadata = {
            name: `"LegalAid-LowIncome.pdf"`,
            parents: [folderId],
        };

        const media = {
            mimeType: "application/pdf",
            body: readableStream,
        };
        await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id",
        });

        shareWithPersonalAccount(folderId, sharingGmail);//the gmail sharing account that belong to the company
        //sharingGmail || "mkabary8@gmail.com" || "hassantarekha@gmail.com"
        console.log("PDF created and uploaded successfully");




    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}




function isAgeBelow18(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        // Subtract 1 from the age if the birth month is later than the current month,
        // or if the birth month is the same but the birth day is later than the current day
        return age - 1 < 18 ? "Yes" : "No";
    }

    return age < 18 ? "Yes" : "No";
}

async function updateFolderName(folderId, newFolderName) {

    const auth = await google.auth.getClient({
        keyFile: config.credentialFile1,
        scopes: ['https://www.googleapis.com/auth/drive'],
    }); // Authenticate with your service account

    const drive = google.drive({ version: 'v3', auth });

    try {
        const updatedFolderMetadata = await drive.files.update({
            fileId: folderId,
            resource: {
                name: newFolderName,
            },
        });

        console.log(`Folder name updated to: ${updatedFolderMetadata.data.name}`);
    } catch (error) {
        console.error(`Error updating folder name: ${error.message}`);
    }
}

async function shareWithPersonalAccount(folderId, personalAccountEmail) {
    try {
        const authClient = await google.auth.getClient({
            keyFile: config.credentialFile1,
            scopes: ['https://www.googleapis.com/auth/drive'],
        });

        const drive = google.drive({ version: 'v3', auth: authClient });

        const permission = {
            type: 'user',
            role: 'writer',
            emailAddress: personalAccountEmail,
        };

        await drive.permissions.create({
            fileId: folderId,
            requestBody: permission,
        });

        console.log('Folder shared successfully!');
    } catch (error) {
        console.error('Error sharing folder:', error.message);
    }
}



module.exports = router

