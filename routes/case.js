const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");
const nodemailer = require("nodemailer")
const decryptTwillioData = require('../middleware/getDataFromTwilio');
const config = require("../config/config");
const dateNow = require("../global/dateNow");
const { google } = require("googleapis");

const { OAuth2Client } = require('google-auth-library');



function extractDateTime(timestamp) {
  const dateObj = new Date(timestamp);

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1; // Months are zero-based, so we add 1
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();

  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return {
    date: formattedDate,
    startTime: formattedTime
  };
}
function formatDateToSlash(inputDate) {
  if(inputDate===''){
    return ""
}
if(inputDate){

  return inputDate.replace(/-/g, '/');
}
  console.log("xxx" , inputDate)



}


const confirmationMIAMforBooking = function (meetingDetails, clientDetials, companyDetails) {
  /*

  meetingDetails.date
  meetingDetails.startTime
  meetingDetails.location
  meetingDetails.mediatorName
  meetingDetails.MIAM1Link

  clientDetials.email,
  clientDetials.clientName

   companyDetails.companyName
   companyDetails.email
   companyDetails.mediatorEmail
  
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

  let mailList = `${clientDetials.email},${companyDetails.mediatorEmail}`;
  console.log("mailList", mailList)
  transporter.sendMail({
    from: config.companyEmail,
    to: `${mailList}`,
    subject: `MIAM Confirmation Mail`,
    html: ` <div style=" text-align: left;">
       <h1>Dear  <span style="color:#9900ff"> ${clientDetials.clientName} </span> </h1>

       <p>Thank you for booking your MIAM , Your appointment is <span style="color:#9900ff">${meetingDetails.date}</span>  at<span style="color:#9900ff">${meetingDetails.startTime}</span>  via  
       <span style="color:#9900ff"> ${meetingDetails.location}</span>. </p>
       <p>${meetingDetails.zoomLink}</p>

       <p>My colleague mediator <span style="color:#9900ff;"> ${meetingDetails.mediatorName}</span>  will contact you at the allocated date & time </p>

        <p> <span style="color:red">IMPORTANT</span> Please complete the MIAM Part 1 form prior to your appointment, which can be accessed here:
        <a style="color:#9900ff" href='${meetingDetails.MIAM1Link}'>${meetingDetails.MIAM1Link}</a>  </p>
        </p>

        <p>If you have any questions, please get in touch </p>
       <p>Kind Regards</p>
      <h3>Direct Mediation Services</h3>
      <h4>${companyDetails.companyName}</h4>
      <h4>${companyDetails.email}</h4>
       </div>`


  });


  // transporter.sendMail(info, (error, info) => {
  //     if (error) {
  //         console.log('Error occurred while sending email:', error.message);

  //     } else {
  //         console.log('Email sent successfully:', info.messageId);
  //     }
  // });


}



const sendSMS_MIAM1 = function (twillioInfo, companyData, clientData, messageBodyinfo, res) {

  /*
    twillioInfo={twillioSID , twillioToken , twillioNumber}
   companyData ={companyName }
   clientData = {clientName ,clientNumber}
   messageBodyinfo = {formtype,formUrl}

  */


  const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
  const phoneNumber = twillioInfo.twillioNumber;

  const messageBody = `Dear ${clientData.clientName}  ,
  Thanks for booking you MIAM . BEFORE your Mediation information & Assessment Meeting (MIAM) with one of our family mediators ,
  we need you to complete an online ${messageBodyinfo.formtype} form records basic information about you and your situation.
  Please click on the link   ${messageBodyinfo.formUrl} ,
  Best Regards ${companyData.companyName} `
  x.messages.create({
    body: messageBody,
    from: phoneNumber,
    to: clientData.clientNumber
  }).then(message => {
    console.log({ message: "form message sent succesfully", messageID: message.sid });
    res.status(200).json({ message: "MIAM 1 link has been sent " })
  }
  ).catch((err) => {

    console.log(err.message)
    res.status(400).json({ message: err.message })
  });

}
const sendSMS_Passporting = function (twillioInfo, companyData, clientData, messageBodyinfo, res) {

  /*
    twillioInfo={twillioSID , twillioToken , twillioNumber}
   companyData ={companyName }
   clientData = {clientName ,clientNumber}
   messageBodyinfo = {formtype,formUrl}
  */


  const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
  const phoneNumber = twillioInfo.twillioNumber;

  const messageBody = `Dear ${clientData.clientName}  ,
  Thank you for contacting us regarding your Legal Aid application for family mediation.
    To start your application please follow the link passporting form records basic information about you and your situation.
  Please click on the link   ${messageBodyinfo.formUrl} Applications are only considered via this route.,
  Best Regards ${companyData.companyName} `
  x.messages.create({
    body: messageBody,
    from: phoneNumber,
    to: clientData.clientNumber
  }).then(message => {
    console.log({ message: "form message sent succesfully", messageID: message.sid });
    res.status(200).json({ message: "Passporting form link has been sent " })
  }
  ).catch((err) => {

    console.log(err.message)
    res.status(400).json({ message: err.message })
  });

}
const sendSMS_LowIncome = function (twillioInfo, companyData, clientData, messageBodyinfo, res) {

  /*
    twillioInfo={twillioSID , twillioToken , twillioNumber}
   companyData ={companyName }
   clientData = {clientName ,clientNumber}
   messageBodyinfo = {formtype,formUrl}
  /*

   companyData ={companyName , email}
   clientData = {clientName ,email}
   messageBodyinfo = {formUrl}

  

  */


  const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
  const phoneNumber = twillioInfo.twillioNumber;

  const messageBody = ` Dear ${clientData.clientName}  ,
  Thank you for contacting us regarding your Legal Aid application for family mediation.
    To start your application please follow the link  low-income form records basic information about you and your situation.
  Please click on the link   ${messageBodyinfo.formUrl} Applications are only considered via this route.,
  Best Regards ${companyData.companyName} `
  x.messages.create({
    body: messageBody,
    from: phoneNumber,
    to: clientData.clientNumber
  }).then(message => {
    console.log({ message: "form message sent succesfully", messageID: message.sid });
    res.status(200).json({ message: "LowIncome form link has been sent " })
  }
  ).catch((err) => {

    console.log(err.message)
    res.status(400).json({ message: err.message })
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


    secureConnection: false,

    auth: {
      user: config.companyEmail,
      pass: config.appPassWord,
    },

  })


  transporter.sendMail({
    from: config.companyEmail,
    to: clientData.email,
    subject: `Applying To ${messageBodyinfo.formType} Form`,
    html: ` <div style=" text-align: left; ">
     <h6>Dear ${clientData.clientName}  </h6>
    <p> Thanks for booking you MIAM . BEFORE your Mediation information & Assessment Meeting (MIAM) with one of our family mediators ,
     we need you to complete an online form records basic information about you and your situation. </p>
     Please click on the link below 
    <a href='${messageBodyinfo.formUrl}'  style=" padding:5px;"> ${messageBodyinfo.formUrl} </a>
    <h3>Direct Mediation Services</h3>
    <h4>${companyData.companyName}</h4>
    <h4>${companyData.email}</h4>
     </div>`


  });


  // transporter.sendMail(info, (error, info) => {
  //   if (error) {
  //     console.log('Error occurred while sending email:', error.message);

  //   } else {
  //     console.log('Email sent successfully:', info.messageId);
  //   }
  // });

}
const sendMailPassporting = function (companyData, clientData, messageBodyinfo) {

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


  transporter.sendMail({
    from: config.companyEmail,
    to: clientData.email,
    subject: `Applying To ${messageBodyinfo.formType} Form`,
    html: ` <div style="text-align: left; ">
     <h1>Hi  ${clientData.clientName}  </h1>
    <p> Thank you for contacting us regarding your Legal Aid application for family mediation.
    To start your application please follow the link below:</p>
    <a href='${messageBodyinfo.formUrl}'  style="  padding:5px; "> ${messageBodyinfo.formUrl} </a>
    <p>Applications are only considered via this route.</p>
    <h3>Direct Mediation Services</h3>
    <h4>${companyData.companyName}</h4>
    <h4>${companyData.email}</h4>
     </div>`


  });


  // transporter.sendMail(info, (error, info) => {
  //   if (error) {
  //     console.log('Error occurred while sending email:', error.message);

  //   } else {
  //     console.log('Email sent successfully:', info.messageId);
  //   }
  // });

}
const sendMailLowIncome = function (companyData, clientData, messageBodyinfo) {

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


  transporter.sendMail({
    from: config.companyEmail,
    to: clientData.email,
    subject: `Applying To ${messageBodyinfo.formType} Form`,
    html: ` <div style="text-align: left; ">
     <h1>Dear ${clientData.clientName}  </h1>
    <p>Thank you for contacting us regarding your Legal Aid application for family mediation.
    To start your application please follow the link below::</p>
     
    <a href='${messageBodyinfo.formUrl}'  style="  padding:5px; "> ${messageBodyinfo.formUrl} </a>
    <h3>Applications are only considered via this route .</h3>
    <h3>Direct Mediation Services</h3>
    <h4>${companyData.companyName}</h4>
    <h4>${companyData.email}</h4>
     </div>`


  });


  // transporter.sendMail(info, (error, info) => {
  //   if (error) {
  //     console.log('Error occurred while sending email:', error.message);

  //   } else {
  //     console.log('Email sent successfully:', info.messageId);
  //   }
  // });

}



const clientSecret = require(config.googleCredentialFile2);
console.log(clientSecret)
const clientId = clientSecret.web.client_id;
const clientSecretKey = clientSecret.web.client_secret;
const redirectUri = 'https://dms5.onrender.com/oauth2callback';
const oAuth2Client = new OAuth2Client(clientId, clientSecretKey, redirectUri);


const createEvent = async (userId, eventTitle, eventDate, attendees) => {
    try {
      // In a real-world scenario, you would retrieve the refresh token from your database
      // instead of hardcoding it here
      const company = await Company.findById(userId);
      const refreshToken = company.googleRefreshToken;
      oAuth2Client.setCredentials({ refresh_token: refreshToken });
  
      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
      // Filter out undefined or missing emails
      const validAttendees = attendees.filter(email => email);

      const eventDetails = {
        summary: eventTitle,
        start: { dateTime: eventDate, timeZone: 'UTC' },
        end: { dateTime: eventDate, timeZone: 'UTC' },
        attendees: validAttendees.map(email => ({ email })),
      };
  
      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: eventDetails,
      });
  
      return { eventId: response.data.id, message: 'Event created successfully!' };
    } catch (error) {
      console.error('Error creating event:', error.message);
      throw new Error('Internal Server Error');
    }
  };


router.post('/creatCase', authMiddleware , decryptTwillioData, async (req, res, next) => {

  // console.log(req.body);
  let companyData = {};
  let clientData = {};
  let messageBodyinfo = {};

  /*
  req.body {
      "firstName": "hassan",
      "surName": "fgvds",
      "phoneNumber": "+447476544877",
      "email": "doaa51094@gmail.com",
      "mediatorMail": "comp@comp.com",
      "caseType": "private | LegalAid",
      "legalAidType": "passporting | lowIncome ",
       "dateOfMAIM": "2023-09-14T00:00:00",
      "location": "Whatsapp video",
      "zoomLink":"xxxxxxxxx"
  }
  
  */

  try {
    if (req.userRole == 'company') {
      let { firstName, surName, phoneNumber, email, dateOfMAIM, location, zoomLink, mediatorMail, caseType, legalAidType } = req.body;
      let MIAM_C1_Date = dateOfMAIM
      const Themediator = await mediator.findOne({ email: mediatorMail });
      // console.log(Themediator);
      const companyId = req.user._id;
      const mediatorOfTheCase = `${Themediator.firstName} ${Themediator.lastName}`;
      let caseReady;
      let LAtabelObj;




      let case_type;
      if (caseType == "private") {
        case_type = 'Private';
        caseReady = true;
        LAtabelObj = {};

      }
      else if (caseType == "LegalAid" && legalAidType == "passporting") {
        case_type = 'Legal Aid ( Passporting)'
        caseReady = false;
        LAtabelObj = {
          clientType: "C1",
          firstName: firstName,
          sureName: surName,
          typeOfApplication: "Passporting",
          status: "Application Received",
          DoB: "",
          postCode: "",
          phoneNo: phoneNumber,
          email: email,
          address: location,
          howFoundUs: "",
          surNameOftheOtherPerson: "",
          caseAbout:"",
        }
      }
      else if (caseType == "LegalAid" && legalAidType == "lowIncome") {
        case_type = 'Legal Aid ( Low Income / No Income)';
        caseReady = false;
        LAtabelObj = {
          clientType: "C1",
          firstName: firstName,
          sureName: surName,
          typeOfApplication: " Low Income / No Income",
          status: "Application Received",
          DoB: "",
          postCode: "",
          phoneNo: phoneNumber,
          email: email,
          address: location,
          howFoundUs: "",
          surNameOftheOtherPerson: "",
          caseAbout:"",
        }
      }

      let Reference = `${surName} `;


      const auth = await google.auth.getClient({

        keyFile: config.credentialFile1,

        scopes: ['https://www.googleapis.com/auth/drive'], // Scopes required for accessing Google Drive
      });


      const drive = google.drive({ version: "v3", auth });
      // // Get the folder ID using the reference object (folder name)
      // const response = await drive.files.list({
      //   q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
      // });


      // Create the folder in Google Drive
      const folderMetadata = {
        name: Reference,
        mimeType: "application/vnd.google-apps.folder",
      };
      
      const folder = await drive.files.create({
        resource: folderMetadata,
        fields: "id",
      });
      const folderId = folder.data.id;


      let newCaseID;
      if (Themediator) {

        if (dateOfMAIM) {

          dateOfMAIM = extractDateTime(dateOfMAIM).date
          // console.log("date", dateOfMAIM)

        } else {
          dateOfMAIM = "00-00-0000"
          // console.log("date", dateOfMAIM)

        }
        // console.log('LAtabelObj: ', LAtabelObj);
        let newCase = await Case.insertMany(
          {
            client1ContactDetails: { firstName, surName, phoneNumber, email, dateOfMAIM, location, caseType, legalAidType },
            startDate: dateOfMAIM,
            status: `New Case`,
            caseTypeC1: case_type,
            Reference,
            caseReady,
            mediatorOfTheCase,
            MajorDataC1: {
              fName: firstName,
              sName: surName,
              mail: email,
              phoneNumber: phoneNumber
            },
            legalAidTableData: {
              C1: JSON.stringify(LAtabelObj)
            },
            $set: {

              'MIAMDates.MIAM_C1_Date': MIAM_C1_Date,

            },


            connectionData: { companyID: req.user._id, mediatorID: Themediator._id },
            folderID: folderId
          });

        // console.log("newCase", newCase[0].legalAidTableData)

        let statusRemider = {
          reminderID: `${newCase[0]._id}-statusRemider`,
          reminderTitle: `${Reference}-${newCase[0].status}`,
          startDate: dateNow()
        }


        await Case.findByIdAndUpdate(newCase[0]._id, {
          $set: {
            'Reminders.statusRemider': statusRemider
          }
        });


        newCaseID = newCase[0]._id



        // Update the company's cases array with the new case ID
        await Company.findByIdAndUpdate(companyId, { $push: { cases: newCase[0]._id } });
        await mediator.findByIdAndUpdate(Themediator._id, { $push: { cases: newCase[0]._id } });



        
        clientData.clientNumber = phoneNumber;
        clientData.email = email;
        // console.log(clientData.email )
        clientData.clientName = `${newCase[0].client1ContactDetails.firstName} ${newCase[0].client1ContactDetails.surName}`;
        companyData.companyName = req.user.companyName;
        companyData.email = req.user.email;
        let twillioInfo = req.twillioInfo;


        if (req.body.caseType == 'private') {
          let meetingDetails = {}, clientDetials = {}, companyDetails = {};
          meetingDetails.date = extractDateTime(req.body.dateOfMAIM).date
          meetingDetails.startTime = extractDateTime(req.body.dateOfMAIM).startTime
          meetingDetails.location = req.body.location
          meetingDetails.mediatorName = mediatorOfTheCase
          meetingDetails.MIAM1Link = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/C1/${newCase[0]._id}`;
          clientDetials.email = req.body.email;
          clientDetials.clientName = `${req.body.firstName} ${req.body.surName}`
          companyDetails.companyName = req.user.companyName
          companyDetails.email = req.user.email
          companyDetails.mediatorEmail = req.body.mediatorMail
          confirmationMIAMforBooking(meetingDetails, clientDetials, companyDetails);

          messageBodyinfo.formType = "MIAM 1"
          messageBodyinfo.formUrl = `${config.baseUrlMIAM1}/${config.MIAM_PART_1}/C1/${newCase[0]._id}`;
          sendMailMIAM1(companyData, clientData, messageBodyinfo);

          // add reminder
          const reminderTitle = `MIAM with ${clientData.clientName} `;
          const attendees = [Themediator.email , email];

          console.log(companyId , reminderTitle, attendees ,MIAM_C1_Date );

          await createEvent(companyId , reminderTitle , MIAM_C1_Date , attendees);
          await Company.findByIdAndUpdate(companyId, {
              $push: { Reminders: { reminderTitle, MIAM_C1_Date } }
          })


          res.status(200).json({ caseID: newCaseID })

        }
        else if (req.body.legalAidType == 'lowIncome' && req.body.caseType == 'LegalAid') {
          messageBodyinfo.formType = "low Income / No Income"
          messageBodyinfo.formUrl = `${config.baseUrllowIncomeForm}/${config.LOWINCOME_NOINCOME}/C1/${newCase[0]._id}`;
          sendMailLowIncome(companyData, clientData, messageBodyinfo);
          sendSMS_LowIncome(twillioInfo, companyData, clientData, messageBodyinfo, res)
          res.status(200).json(/*{ caseID: newCaseID }*/"email and sms has been sent to the client");
        }
        else if (req.body.legalAidType == 'passporting' && req.body.caseType == 'LegalAid') {
          messageBodyinfo.formType = 'Passporting'
          messageBodyinfo.formUrl = `${config.baseUrlpassportingForm}/${config.PASSPORTING}/C1/${newCase[0]._id}`;
            sendMailPassporting(companyData, clientData, messageBodyinfo);

          sendSMS_Passporting(twillioInfo, companyData, clientData, messageBodyinfo, res)

          res.status(200).json(/*{ caseID: newCaseID }*/"email and sms has been sent to the client");
        }
        else {
          res.status(400).json({ "message": "please confirm case type" })
        }


      }
      else {
        res.status(400).json({ "message": "please add the mediator first" })
      }


    }

    else {
      res.status(400).json({ 'message': "error in the role of token" })
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }

});


router.get('/getCasesList', authMiddleware, async (req, res) => {

  let client1data, Reference, startDate, tempRefDummyData, MIAM2mediator
  let resposedCaseObj, casesList = [];
  let tempDate

  try {
    let caseMediator;
    let mediatorName;
    if (req.userRole == "company") {
      let cases = await Company.findById(req.user._id).populate('cases');
      for (let i = 0; i < cases.cases.length; i++) {
        //    caseMediator = await Case.findById(cases.cases[i]._id).populate('connectionData.mediatorID');
        //    console.log(caseMediator)
        //   mediatorName = `${caseMediator.connectionData.mediatorID?.firstName} ${caseMediator.connectionData.mediatorID?.lastName}`;

        if (cases.cases[i].caseReady) {
          resposedCaseObj = {
            _id: cases.cases[i]._id,
            Reference: cases.cases[i].Reference,
            status: cases.cases[i].status,
            startDate: formatDateToSlash(cases.cases[i].startDate),
            closed: cases.cases[i].closed,
            mediatorName: cases.cases[i].mediatorOfTheCase
          }

          casesList.push(resposedCaseObj)

        }


      }


      res.status(200).json(casesList)

    }
    else if (req.userRole == "mediator") {


      let cases = await mediator.findById(req.user._id).populate('cases');

      for (let i = 0; i < cases.cases.length; i++) {
        caseMediator = await Case.findById(cases.cases[i]._id).populate('connectionData.mediatorID');
        mediatorName = `${caseMediator.connectionData.mediatorID?.firstName} ${caseMediator.connectionData.mediatorID?.lastName}`;
        if (cases.cases[i].caseReady) {

          resposedCaseObj = {
            _id: cases.cases[i]._id,
            Reference: cases.cases[i].Reference,
            status: cases.cases[i].status,
            startDate: formatDateToSlash(cases.cases[i].startDate),
            closed: cases.cases[i].closed,
            mediatorName: cases.cases[i].mediatorOfTheCase
          }

          casesList.push(resposedCaseObj)
        }

      }


      res.status(200).json(casesList)

    }
    else {
      res.status(400).json("error with auth role ")
    }
  } catch (err) {
    res.status(400).json(err.message)
  }


})

router.get('/getCasesDetails/:id', authMiddleware, async (req, res) => {

  let CaseFound, CaseResponse, MIAM1_C1, MIAM1_C2, MIAM2_C1, MIAM2_C2, MajorDataC1, MajorDataC2, C2invitation;
  let Reminders, MIAMDates, availableTimes_C1, availableTimes_C2, caseTypeC1, caseTypeC2, C1Agreement, C2Agreement, mediationRecords = [],
    caseSuitable, caseLogs, folderID, majorDataC2FromM1;



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
        if (CaseFound.MIAM2C2) MIAM2_C2 = JSON.parse(CaseFound.MIAM2C2); else MIAM2_C2 = "Data didn't added yet";
        if (CaseFound.C2invitation) C2invitation = JSON.parse(CaseFound.C2invitation); else C2invitation = "Data didn't added yet";

        if (CaseFound.mediationRecords) {
          for (let i = 0; i < CaseFound.mediationRecords.length; i++) {
            mediationRecords.push(JSON.parse(CaseFound.mediationRecords[i]))
          }
        }

        else mediationRecords = "there is no mediation session yet";


        CaseFound.MIAMDates ? MIAMDates = CaseFound.MIAMDates : MIAMDates = "MIAM Dates didn't added yet"
        CaseFound.availableTimes_C1 ? availableTimes_C1 = CaseFound.availableTimes_C1 : availableTimes_C1 = "Available times didn't added yet"

        CaseFound.availableTimes_C2 ? availableTimes_C2 = CaseFound.availableTimes_C2 : availableTimes_C2 = "Available times didn't added yet"

        CaseFound.caseTypeC1 ? caseTypeC1 = CaseFound.caseTypeC1 : caseTypeC1 = "Case type with client1 still ignored"
        CaseFound.caseTypeC2 ? caseTypeC2 = CaseFound.caseTypeC2 : caseTypeC2 = "Case type with client2 still ignored"

        CaseFound.C1Agreement ? C1Agreement = JSON.parse(CaseFound.C1Agreement) : C1Agreement = ""
        CaseFound.C2Agreement ? C2Agreement = JSON.parse(CaseFound.C2Agreement) : C2Agreement = "";

        if (MIAM2_C1.FinalComments?.isSuitable == "Yes" && MIAM2_C2.FinalComments?.isSuitable == "Yes") {
          caseSuitable = "Suitable"

        } else if (MIAM2_C1.FinalComments?.isSuitable == "NO" || MIAM2_C2.FinalComments?.isSuitable == "No") {
          caseSuitable = "Not Suitable"
        }
        else {
          caseSuitable = "MIAM2_C2 not filled"
        }

        CaseFound.folderID ? folderID = CaseFound.folderID : folderID = "folderID  didn't added yet";

        CaseFound.majorDataC2FromM1 ? majorDataC2FromM1 = CaseFound.majorDataC2FromM1 : majorDataC2FromM1 = "Client 2 data did not add yet"


        Reminders = CaseFound.Reminders
        MajorDataC1 = CaseFound.MajorDataC1;
        caseLogs = CaseFound.caseLogs
        JSON.stringify(CaseFound.MajorDataC2) === '{}' ? MajorDataC2 = "C2 Data didn't added yet" : MajorDataC2 = CaseFound.MajorDataC2


        CaseResponse = {
          Reference: CaseFound.Reference,
          client1ContactDetails: CaseFound.client1ContactDetails,
          startDate: CaseFound.startDate,
          status: CaseFound.status,
          closed: CaseFound.closed,
          MIAM1_C1,
          MIAM2_C1,
          MIAM1_C2,
          MIAM2_C2,
          MajorDataC1,
          MajorDataC2,
          C2invitation,
          Reminders,
          MIAMDates,
          availableTimes_C1,
          availableTimes_C2,
          caseTypeC1,
          caseTypeC2,
          C1Agreement,
          C2Agreement,
          mediationRecords,
          caseSuitable,
          caseLogs,
          folderID,
          majorDataC2FromM1


        }

        res.status(200).json(CaseResponse)
      }
      else {
        res.status(400).json(" you don't have the access on this case ")
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
        if (CaseFound.C2invitation) C2invitation = JSON.parse(CaseFound.C2invitation); else C2invitation = "Data didn't added yet";
        if (CaseFound.mediationRecords) {
          for (let i = 0; i < CaseFound.mediationRecords.length; i++) {
            mediationRecords.push(JSON.parse(CaseFound.mediationRecords[i]))
          }
        } else mediationRecords = "there is no mediation session yet";

        CaseFound.MIAMDates ? MIAMDates = CaseFound.MIAMDates : MIAMDates = "MIAM Dates didn't added yet"

        CaseFound.availableTimes_C1 ? availableTimes_C1 = CaseFound.availableTimes_C1 : availableTimes_C1 = "Available times didn't added yet"
        CaseFound.availableTimes_C2 ? availableTimes_C2 = CaseFound.availableTimes_C2 : availableTimes_C2 = "Available times didn't added yet"

        CaseFound.caseTypeC1 ? caseTypeC1 = CaseFound.caseTypeC1 : caseTypeC1 = "Case type with client1 still ignored"
        CaseFound.caseTypeC2 ? caseTypeC2 = CaseFound.caseTypeC2 : caseTypeC2 = "Case type with client2 still ignored"

        CaseFound.C1Agreement ? C1Agreement = JSON.parse(CaseFound.C1Agreement) : C1Agreement = ""
        CaseFound.C2Agreement ? C2Agreement = JSON.parse(CaseFound.C2Agreement) : C2Agreement = "";

        if (MIAM2_C1.FinalComments?.isSuitable === "Yes" && MIAM2_C2.FinalComments?.isSuitable === "Yes") {
          caseSuitable = "Suitable"

        } else if (MIAM2_C1.FinalComments?.isSuitable == "NO" || MIAM2_C2.FinalComments?.isSuitable == "No") {
          caseSuitable = "Not Suitable"
        }
        else {
          caseSuitable = "MIAM2_C2 not filled"
        }
        CaseFound.folderID ? folderID = CaseFound.folderID : folderID = "folderID  didn't added yet";
        CaseFound.majorDataC2FromM1 ? majorDataC2FromM1 = CaseFound.majorDataC2FromM1 : majorDataC2FromM1 = "Client 2 data did not add yet"


        Reminders = CaseFound.Reminders
        MajorDataC1 = CaseFound.MajorDataC1;
        caseLogs = CaseFound.caseLogs


        JSON.stringify(CaseFound.MajorDataC2) === '{}' ? MajorDataC2 = "C2 Data didn't added yet" : MajorDataC2 = CaseFound.MajorDataC2


        CaseResponse = {
          Reference: CaseFound.Reference,
          client1ContactDetails: CaseFound.client1ContactDetails,
          startDate: CaseFound.startDate,
          status: CaseFound.status,
          closed: CaseFound.closed,
          MIAM1_C1,
          MIAM2_C1,
          MIAM1_C2,
          MIAM2_C2,
          MajorDataC1,
          MajorDataC2,
          C2invitation,
          Reminders,
          MIAMDates,
          availableTimes_C1,
          availableTimes_C2,
          caseTypeC1,
          caseTypeC2,
          C1Agreement,
          C2Agreement,
          mediationRecords,
          caseSuitable,
          caseLogs,
          folderID,
          majorDataC2FromM1
        }

        res.status(200).json(CaseResponse)
      }
      else {
        res.status(400).json(" you don't have the access on this case ")
      }
    }
    else {
      res.status(400).json("err with user Auth")
    }

  } catch (err) {
    res.status(400).json(err.message)
  }


})

router.get('/getLegalAidClients', authMiddleware, async (req, res) => {


  let parcedC1Data, parcedC2Data, clientsDataList = [];


  try {
    let caseMediator;
    if (req.userRole == "company") {
      let cases = await Company.findById(req.user._id).populate('cases');
      for (let i = 0; i < cases.cases.length; i++) {
        //    caseMediator = await Case.findById(cases.cases[i]._id).populate('connectionData.mediatorID');
        //    console.log(caseMediator)
        //   mediatorName = `${caseMediator.connectionData.mediatorID?.firstName} ${caseMediator.connectionData.mediatorID?.lastName}`;
        console.log(cases.cases[i].legalAidTableData.C1)
        if (cases.cases[i].legalAidTableData.C1) {
          parcedC1Data = JSON.parse(cases.cases[i].legalAidTableData.C1);

          let C1Data =
          {
            _id: cases.cases[i]._id,
            clientType: "C1",
            firstName: parcedC1Data.firstName,
            sureName: parcedC1Data.sureName,
            typeOfApplication: parcedC1Data.typeOfApplication,
            status: parcedC1Data.status,
            DoB: formatDateToSlash(parcedC1Data.DoB),
            postCode: parcedC1Data.postCode,
            phoneNo: parcedC1Data.phoneNo,
            email: parcedC1Data.email,
            address: parcedC1Data.address,
            howFoundUs: parcedC1Data.howFoundUs,
            surNameOftheOtherPerson: parcedC1Data.surNameOftheOtherPerson,
            caseAbout:parcedC1Data.caseAbout,

          }
          if (C1Data.firstName) {

            clientsDataList.push(C1Data)
          }
        }
        if (cases.cases[i].legalAidTableData.C2) {
          parcedC2Data = JSON.parse(cases.cases[i].legalAidTableData.C2);
          console.log(parcedC2Data, "parcedC2Data")
          let C2Data =
          {
            _id: cases.cases[i]._id,
            clientType: "C2",
            firstName: parcedC2Data.firstName,
            sureName: parcedC2Data.sureName,
            typeOfApplication: parcedC2Data.typeOfApplication,
            status: parcedC2Data.status,
            DoB: formatDateToSlash(parcedC2Data.DoB),
            postCode: parcedC2Data.postCode,
            phoneNo: parcedC2Data.phoneNo,
            email: parcedC2Data.email,
            address: parcedC2Data.address,
            howFoundUs: parcedC2Data.howFoundUs,
            surNameOftheOtherPerson: parcedC2Data.surNameOftheOtherPerson,
            caseAbout:parcedC2Data.caseAbout,
          }
          if (C2Data.firstName) { clientsDataList.push(C2Data) }

        }

      }


      res.status(200).json(clientsDataList)

    }
    else if (req.userRole == "mediator") {
      let cases = await mediator.findById(req.user._id).populate('cases');
      for (let i = 0; i < cases.cases.length; i++) {
        caseMediator = await Case.findById(cases.cases[i]._id).populate('connectionData.mediatorID');
        mediatorName = `${caseMediator.connectionData.mediatorID?.firstName} ${caseMediator.connectionData.mediatorID?.lastName}`;
        if (cases.cases[i].legalAidTableData.C1) {
          parcedC1Data = JSON.parse(cases.cases[i].legalAidTableData.C1)
          let C1Data =
          {
            _id: cases.cases[i]._id,
            clientType: "C1",
            firstName: parcedC1Data.firstName,
            sureName: parcedC1Data.sureName,
            typeOfApplication: parcedC1Data.typeOfApplication,
            status: parcedC1Data.status,
            DoB: formatDateToSlash(parcedC1Data.DoB),
            postCode: parcedC1Data.postCode,
            phoneNo: parcedC1Data.phoneNo,
            email: parcedC1Data.email,
            address: parcedC1Data.address,
            howFoundUs: parcedC1Data.howFoundUs,
            surNameOftheOtherPerson: parcedC1Data.surNameOftheOtherPerson,
            caseAbout:parcedC1Data.caseAbout,
          }
          if (C1Data.firstName) {

            clientsDataList.push(C1Data)
          }
        }
        if (cases.cases[i].legalAidTableData.C2) {
          parcedC2Data = JSON.parse(cases.cases[i].legalAidTableData.C2);
          let C2Data =
          {
            _id: cases.cases[i]._id,
            clientType: "C2",
            firstName: parcedC2Data.firstName,
            sureName: parcedC2Data.sureName,
            typeOfApplication: parcedC2Data.typeOfApplication,
            status: parcedC2Data.status,
            DoB: formatDateToSlash(parcedC2Data.DoB),
            postCode: parcedC2Data.postCode,
            phoneNo: parcedC2Data.phoneNo,
            email: parcedC2Data.email,
            address: parcedC2Data.address,
            howFoundUs: parcedC2Data.howFoundUs,
            surNameOftheOtherPerson: parcedC2Data.surNameOftheOtherPerson,
            caseAbout:parcedC2Data.caseAbout,
          }
          if (C2Data.firstName) { clientsDataList.push(C2Data) }

        }

      }

      res.status(200).json(clientsDataList)

    }
    else {
      res.status(400).json("error with auth role ")
    }
  } catch (err) {
    res.status(400).json(err.message)
  }


})


module.exports = router;


