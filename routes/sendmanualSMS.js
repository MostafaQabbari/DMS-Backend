const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const decryptTwillioData = require('../middleware/getDataFromTwilio');
const nodemailer = require("nodemailer");
const company = require("../models/company");
const config = require("../config/config");
const mediator = require('../models/mediator');

const sendSMS_manual = function (twillioInfo, clientNumber, messageBodyData , res) {

    /*
      twillioInfo={twillioSID , twillioToken , twillioNumber}
      clientNumber = {clientNumber}
      messageBodyData = bodyText
    */
    const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
    const phoneNumber = twillioInfo.twillioNumber;


    x.messages.create({
        body: messageBodyData,
        from: phoneNumber,
        to: clientNumber
    }).then(message => {
        console.log({ message: "form message sent succesfully", messageID: message.sid });
        res.status(200).json({ message: "SMS has been sent " })
    }
    ).catch((err) => {

        console.log(err.message)
        res.status(400).json({ message: err.message })
    });

}

const sendSMS_invitaion = function (twillioInfo, clientNumber, clientName ,res) {

    /*
      twillioInfo={twillioSID , twillioToken , twillioNumber}
      clientNumber = clientNumber
      clientName =clientName
 
    */
    const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
    const phoneNumber = twillioInfo.twillioNumber;

    const textBody = `Dear ${clientName}
    You've been sent an inviation to family mediation by email/post .
    Please call our office on ${twillioInfo.twillioNumber}.
    Look forward to hearing from you.
    `


    x.messages.create({
        body: textBody,
        from: phoneNumber,
        to: clientNumber
    }).then(message => {
        console.log({ message: "form message sent succesfully", messageID: message.sid });
        res.status(200).json({ message: "SMS has been sent " })

    }
    ).catch((err) => {

        console.log(err.message)
        res.status(400).json({ message: err.message })
    });

}


const sendMail_Invitation = function (clientDetails, compnayDetails) {

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

    /*{
           clientDetails.name,
           clientDetails.email
          compnayDetails.phone
          compnayDetails.email
           compnayDetails.name

    }
    */


     transporter.sendMail({
        from: config.companyEmail,
        to: clientDetails.email,
        subject: `Invitation Mail`,
        html: `<body>
        <div style="direction: ltr;">
      
        <h3>Dear <span style="color : blue">${clientDetails.name}</span>   </h3>
 <p>We are writing to introduce our family mediation service, which is accredited with the <a  href="https://www.familymediationcouncil.org.uk/"  style="color : blue"> Family Mediation Council </a>.
  We want to let you know that  <span style="color : red">${clientDetails.name}</span>    has come to us to see about the possibility
   of mediation to sort out arrangements between you both. At this point, they attended
    a Mediation Information & Assessment Meeting
     <a href="https://www.directmediationservices.co.uk/miam/" style="color : blue"> (MIAM) </a> with us. This is the 
    first stage of starting family mediation and allows participants to see whether they feel it is appropriate, 
    and of course for us to assess whether we feel the matter is suitable for mediation. Having met with <span style="color : red">${clientDetails.name}</span>    and listened 
    to their account of the issues faced, it appears that there may be a benefit to using mediation. In view of this, I would like to invite you to a MIAM, 
    so you can give your account of what has been happening and learn more about the mediation process. At this confidential meeting,
     <span style="color : red">${clientDetails.name}</span>    will not be there, or be informed of any of the discussions we have.</p>


     <p>It is important for you to understand that mediation is a voluntary process, but it is strongly encouraged by the Family Court for people to attempt it. 
     However, if you do not engage, I must let you know that we will be obliged to issue a certificate to  <span style="color : red">${clientDetails.name}</span>  stating that mediation is not going ahead. They may then use this certificate, if they decide to make a court application.</p>

     <p>It is a requirement to attend a MIAM before making an application to court, save for a number of specific <a href="https://www.directmediationservices.co.uk/do-i-have-to-attend-a-miam/" style="color : blue"> exemptions </a>. If you have reasons why you feel you cannot attend mediation, you may wish to explain them in a MIAM and discuss them with a mediator. Your mediator can offer support and guidance and conduct an assessment as to the suitability of mediation. If the mediator finds mediation to be unsuitable, you will also get a certificate verifying that you have attempted mediation yourself as well.</p>

     <p>On the other hand, if you are unwilling to try mediation, and a court case ensues, you may have to explain to the court why you did not engage in mediation when invited.</p>

     <p>  I understand that this letter may be a little unsettling; I would like to reassure you that we do not represent <span style="color : red">${clientDetails.name}</span> and represent both of you as equal participants. Additionally, you may not know much about mediation,
      so please do refer to the useful guidance on our website, which may help you with your decision making: <a   href="https://directmediationservices.co.uk/" style="color : blue"> Direct Mediation Services.</a>
  </p>

<p>Finally, I understand that you will want to have absolute transparency in respect of  <a style="color : blue" href="https://www.directmediationservices.co.uk/miam-cost/">fees</a>  and there is full information on the website:</p>

<ul>
<li>MIAM: £130 (inc. VAT)</li>
<li> Mediation Sessions: £130 per person per hour (inc. vat)</li>
<p>Additionally, there are funding options available including:</p>
<li><a href="https://www.directmediationservices.co.uk/mediation-legal-aid/" style="color : blue">Legal Aid</a>  (if you receive income-based welfare benefits or low income)</li>
<li> <a href="https://www.directmediationservices.co.uk/family-mediation-voucher-scheme/" style="color : blue"> Family Mediation</a> Voucher Scheme (a one off voucher of £500 applied to cases relating to child arrangements which is available to all participants. Only available for mediation sessions, not MIAMs).</li>
</ul>

<p>You will only pay for your own fees, not the other participant’s. If you would like further information on Legal Aid eligibility, please contact the office and ensure to inform of your funding status when booking your MIAM.</p>
<p>The easiest and quickest way to respond to your invitation to mediation is by filling our reply to the mediation form that can be accessed by clicking  <a href="https://c2-reply-form.vercel.app/C2_reply/${clientDetails.id}" style="color : blue">HERE</a>.</p>
<p>I would be grateful if I could have your response to this invitation no later than a week from the date of this letter either by email or telephone ${compnayDetails.phone}. In the event that you require a little longer, or require any further guidance in making your decision, then we encourage you to get in touch as soon as possible to let us know.
 If we don’t hear from you, we will assume that you do not wish to engage in mediation</p>
<p>I look forward to hearing from you</p>

<p>Regards</p>
<p>Direct Mediation Services</p>

<p>${compnayDetails.name}</p>
<p>${compnayDetails.email}</p>


        </div>
        </body>`,

    });

}

const sendSMS_mediationUpdate = function (twillioInfo, clientData , res) {

    /*
      twillioInfo={twillioSID , twillioToken , twillioNumber}
      clientData = {clientName,clientNumber}
     
    */
    const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
    const phoneNumber = twillioInfo.twillioNumber;
const bodyText= `Dear ${clientData.clientName} ,
I tried to call you but your line was busy. This is about your family mediation case. Please contact me on ${phoneNumber}.
Regards,
Direct Mediation Services`

    x.messages.create({
        body:bodyText,
        from: phoneNumber,
        to: clientData.clientNumber
    }).then(message => {
        console.log({ message: "form message sent succesfully", messageID: message.sid });
        res.status(200).json({ message: "SMS has been sent " })
        
    }
    ).catch((err) => {

        console.log(err.message)
        res.status(400).json({ message: err.message })
    });

}



router.post('/sendSMS', authMiddleware, decryptTwillioData, async (req, res) => {

    /*
      twillioInfo={twillioSID , twillioToken , twillioNumber}
      clientNumber = {clientNumber}
      messageBodyData = {clientName ,companyName, formLink   }
    */

    let clientNumber;
    let messageBodyData = {};

    let twillioInfo = req.twillioInfo;
    console.log(twillioInfo)

    try {
        /*
            {
            clientNumber:"+44 7476 544877",
            messageBodyData:""
            }

        */

        clientNumber = req.body.clientNumber;
        messageBodyData = req.body.messageBodyData

        // clientNumber = "+44 7476 544877"


        sendSMS_manual(twillioInfo, clientNumber, messageBodyData,res)

       

    } catch (err) {
        res.status(400).json({ message: "error with the end point autherization" })
    }

});

router.post('/sendSMSmediationUpdate/:id', authMiddleware, decryptTwillioData, async (req, res) => {

    let twillioInfo = req.twillioInfo;
    console.log(twillioInfo)

    try {
        /*
        {"Client":"C1"}
        {"Client":"C2"}
        */
        const currentCase = await Case.findById(req.params.id)
        let clientData={}
        if (req.body.Client === "C1") {
   
            clientData.clientNumber = currentCase.MajorDataC1.phoneNumber;
       
            clientData.clientName = `${currentCase.MajorDataC1.fName} ${currentCase.MajorDataC1.sName}`;

            
            sendSMS_mediationUpdate(twillioInfo, clientData ,res)
           


        }
        else if (req.body.Client === "C2") {
       
            clientData.clientNumber = currentCase.MajorDataC2.phoneNumber;
            clientData.clientName = `${currentCase.MajorDataC2.fName} ${currentCase.MajorDataC2.sName}`
            sendSMS_mediationUpdate(twillioInfo, clientData , res)
           // res.status(200).json({ message: "SMS has been sent " })

        }
        else {
            res.status(400).json({ message: "something wrong to choose number of the client" })


        }


    } catch (err) {
        res.status(400).json({ message: "error with the end point autherization" })
    }

});

router.post('/sendSMSinvitation/:id', authMiddleware, decryptTwillioData, async (req, res) => {

    let twillioInfo = req.twillioInfo;
    console.log(twillioInfo)

    try {
        /*
        {"Client":"C1"}
        {"Client":"C2"}
        */
        const currentCase = await Case.findById(req.params.id)
        let clientNumber, clientName;
      //  console.log(currentCase)
        if (req.body.Client === "C1") {

            clientNumber = currentCase.MajorDataC1.phoneNumber;
           // clientNumber = "+44 7476 544877"
            clientName = `${currentCase.MajorDataC1.fName} ${currentCase.MajorDataC1.sName}`
            sendSMS_invitaion(twillioInfo, clientNumber, clientName ,res)
           // res.status(200).json({ message: "SMS has been sent " })


        }
        else if (req.body.Client === "C2") {
            // clientNumber = "+44 7476 544877"
            clientNumber = currentCase.MajorDataC2.phoneNumber;
            clientName = `${currentCase.MajorDataC2.fName} ${currentCase.MajorDataC2.sName}`
            sendSMS_invitaion(twillioInfo, clientNumber, clientName ,res)
            //res.status(200).json({ message: "SMS has been sent " })

        }
        else {
            res.status(400).json({ message: "something wrong to choose number of the client" })


        }


    } catch (err) {
        res.status(400).json({ message: "error with the end point autherization" })
    }

});

router.post('/sendMailInvitation/:id', authMiddleware, async (req, res) => {

    try {
        /*{
        clientDetails.name,
        clientDetails.email
        clientDetails.id
       compnayDetails.phone

      }
     */
        if (req.userRole == "company") {
            const currentCase = await Case.findById(req.params.id);
            const currentComp = await company.findById(req.user._id)

            let clientDetails = {}, compnayDetails = {};
            clientDetails.id = req.params.id
            compnayDetails.email=currentComp.email
            compnayDetails.name = currentComp.companyName

            if (req.body.Client === "C1") {

                clientDetails.email = currentCase.MajorDataC1.mail;
                clientDetails.name = `${currentCase.MajorDataC1.fName} ${currentCase.MajorDataC1.sName}`;

                //clientDetails.email ='abdosamir023023@gmail.com'
                compnayDetails.phone = currentComp.phoneNumberTwillio;

                sendMail_Invitation(clientDetails, compnayDetails)
                res.status(200).json({ message: "invitation mail has been sent " })


            }
            else if (req.body.Client === "C2") {

                clientDetails.email = currentCase.MajorDataC2.mail;
                clientDetails.name = `${currentCase.MajorDataC2.fName} ${currentCase.MajorDataC2.sName}`
                compnayDetails.phone = currentComp.phoneNumberTwillio;
                sendMail_Invitation(clientDetails, compnayDetails)
                res.status(200).json({ message: "invitation mail has been sent " })

            }
            else {
                res.status(400).json({ message: "something wrong to choose number of the client" })


            }

        }
        else if (req.userRole == "mediator") {
       

            let clientDetails = {}, compnayDetails = {};
        

            const currentCase = await Case.findById(req.params.id);
            const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');
             compnayDetails.phone = mediatorCompanyData.companyId.phoneNumberTwillio;
             compnayDetails.email=mediatorCompanyData.companyId.email
             compnayDetails.name = mediatorCompanyData.companyId.companyName

            if (req.body.Client === "C1") {

                clientDetails.email = currentCase.MajorDataC1.mail;
               

                clientDetails.name = `${currentCase.MajorDataC1.fName} ${currentCase.MajorDataC1.sName}`;

                console.log('🥳🥳', clientDetails, compnayDetails)
                sendMail_Invitation(clientDetails, compnayDetails)
                res.status(200).json({ message: "invitation mail has been sent " })

            }
            else if (req.body.Client === "C2") {

                clientDetails.email = currentCase.MajorDataC2.mail;
                clientDetails.name = `${currentCase.MajorDataC2.fName} ${currentCase.MajorDataC2.sName}`

                sendMail_Invitation(clientDetails, compnayDetails)
                res.status(200).json({ message: "invitation mail has been sent " })

            }
            else {
                res.status(400).json({ message: "something wrong to choose number of the client" })


            }

        }


    } catch (err) {
        res.status(400).json({ message: "error with the end point autherization" })
    }

});




module.exports = router;