const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const decryptTwillioData = require('../middleware/getDataFromTwilio');
const nodemailer = require("nodemailer");
const Company = require("../models/company");
const config = require("../config/config");
const mediator = require('../models/mediator');



const sendCIMMail = function (mediatorData, clientDetials, companyDetails , childNames) {
    /*

    mediatorData.name

    clientDetials.c1.email,
    clientDetials.c1.clientName
    clientDetials.c2.email,
    clientDetials.c2.clientName

     companyDetails.companyName
     companyDetails.email
    
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

    let mailList = `${clientDetials.c1email}, ${clientDetials.c2email}`

     transporter.sendMail({
        from: config.companyEmail,
        to: `${mailList}` ,
        subject: `CIM Information`,
        html: ` <div style=" direction: ltr">
         <h2>Dear <span style ="color:blue">${clientDetials.c1clientName}</span> & <span style ="color:red">${clientDetials.c2clientName}</span> </h2>

         <p>I hope this email finds you well.</p>

         <p>Your mediator <span style ="color:blue">${mediatorData.name}</span> has advised us you requested Child Inclusive Mediation (CIM) for ${childNames}.
         Together with this email, you will find a Child Inclusive Mediation - Information sheet for parents, 
         which explains the process of CIM. Please have a read of the document as it contains very important information about CIM.
         We have appointed mediator <span style ="color:blue">${mediatorData.name}</span>  trained to conduct CIM. Adele will be in touch with you after you both have signed the Parental Consent Form. 
         This document will be sent to each of you in a separate email from DropboxSign asking for your electronic signature.</p>

        <p>If you have any questions at this point, please do not hesitate to contact us.</p>
   

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

const sendPropertyMail = function (mediatorData, clientDetials, companyDetails) {
    /*

    mediatorData.name

    clientDetials.c1.email,
    clientDetials.c1.clientName
    clientDetials.c2.email,
    clientDetials.c2.clientName

     companyDetails.companyName
     companyDetails.email
    
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

let mailList = `${clientDetials.c1email}, ${clientDetials.c2email} `
     transporter.sendMail({
        from: config.companyEmail,
        to: `${mailList}` ,
        subject: `Property & Finance`,
        html: ` <div style="padding: 2vw; direction: ltr">
         <h2>Dear <span style ="color:blue">${clientDetials.c1clientName}</span> & <span style ="color:red">${clientDetials.c2clientName}</span> </h2>

         <p>I hope this email finds you well.</p>
         <p>Further to your MIAM I’m pleased to confirm both of you have said you wish to proceed with mediation on a joint basis.
          As you wish to address financial issues in mediation, in preparation for your first meeting I enclose a financial pack which includes the following:</p>
        

         <p>1. <a style="color:blue;" target="_blank" href="https://www.directmediationservices.co.uk/wp-content/uploads/2021/08/FINANCIAL-DISCLOSURE-PACK.docx">Financial Questionnaire </a> (attached to this email) </p>
         <p>2.  Financial Disclosure Checklist (<a style="color:blue;" href="https://directmediationservices.co.uk/wp-content/uploads/2019/04/Financial-disclosure-for-married-couples.pdf">married couples</a> &<a style="color:blue;" href="https://directmediationservices.co.uk/wp-content/uploads/2019/04/Financial-disclosure-for-unmarried-couples.pdf">unmarried couples</a> )    </p>
         <p>3. <a style="color:blue;" href="https://directmediationservices.co.uk/wp-content/uploads/2019/04/Financial-Provision-on-Divorce.pdf">Financial Provision on Divorce</a> </p>
         <p>4. <a style="color:blue;" href="https://www.directmediationservices.co.uk/wp-content/uploads/2023/05/A-guide-for-financial-cases.pdf"> A guide for Financial cases</a> </p>

         <p>As explained in your initial meeting, if financial matters are to be addressed in mediation,
          I do ask that you both commit to providing the form 1,  <a style="color:blue;" target="_blank" href="https://www.directmediationservices.co.uk/wp-content/uploads/2021/08/FINANCIAL-DISCLOSURE-PACK.docx">Financial Questionnaire </a>, filled out before your first mediation session. 
          This form needs to be completed <strong> AT LEAST 7 days </strong> before the first mediation session. However, 
          it is requested that no financial documents i.e., bank statements are sent at this time.
           It is requested that clients email the mediator only with the  <a style="color:blue;" target="_blank" href="https://www.directmediationservices.co.uk/wp-content/uploads/2021/08/FINANCIAL-DISCLOSURE-PACK.docx">Financial Questionnaire </a>. 
           If this is not done, the mediation session will not go ahead as the mediator requires time to review the documents and 
           prepare documentation before the first mediation session.

         If you have any questions at this stage, feel free to let us know</p>
   

        <p>Kind Regards</p>
        <h3>DMS Admin Team</h3>

        <h4>${companyDetails.companyName}</h4>
        <h4>${companyDetails.email}</h4>
         </div>`,
         attachments: [
            {
              filename: 'FINANCIAL-DISCLOSURE-PACK.docx', 
              path: './FINANCIAL-DISCLOSURE-PACK.docx', 
            },
          ],


    });


    // transporter.sendMail(info, (error, info) => {
    //     if (error) {
    //         console.log('Error occurred while sending email:', error.message);

    //     } else {
    //         console.log('Email sent successfully:', info.messageId);
    //     }
    // });


}

router.post('/sendCIM_Mail/:id', authMiddleware, async (req, res, next) => {

    let CaseFound;
    try {
 
        let companyDetails = {}, clientDetials = {}, mediatorData = {} ,childNames ;

        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {

                const currentComp = await Company.findById(req.user._id);
                const currentMediator = await Case.findById(req.params.id).populate('connectionData.mediatorID');
                mediatorData.name = `${currentMediator.connectionData.mediatorID.firstName} ${currentMediator.connectionData.mediatorID.lastName} `;

            
                clientDetials.c2clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                clientDetials.c2email = CaseFound.MajorDataC2.mail
                clientDetials.c1clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                clientDetials.c1email = CaseFound.MajorDataC1.mail
                
                 //clientDetials.c2email = 'abdosamir023023@gmail.com'
              //  clientDetials.c1email = 'abdosamir023023@gmail.com'

                companyDetails.companyName = currentComp.companyName
                companyDetails.email = currentComp.email;

                childNames=""
 
                //JSON.parse()
                let childrensArr = JSON.parse(CaseFound.client1data).children;
                if(childrensArr)
                {
                    if(childrensArr[0]) childNames+= childrensArr[0]['Child One'].firstChildFirstName
                
                    if(childrensArr[1]) childNames+=" and "+childrensArr[1]['Child Two'].secondChildFirstName
                    if(childrensArr[2]) childNames+=" and "+childrensArr[2]['Child Three'].thirdChildFirstName
                  
                    if(childrensArr[3]) childNames+=" and "+childrensArr[3]['Child Four'].forthChildFirstName
                    if(childrensArr[4]) childNames+=" and "+childrensArr[4]['Child Five'].fifthChildFirstName
                    if(childrensArr[5]) childNames+=" and "+childrensArr[5]['Child Six'].sixthChildFirstName
               
                }
                else{
                    childNames=" "
                }
               
                
   

          

                sendCIMMail(mediatorData, clientDetials, companyDetails ,childNames);
                res.status(200).json({ "message": "CIM information mail has been  sent ... " })
            }
            else {
                res.status(400).json({ "message": "no case found ... " })
            }

        }
        else if (req.userRole == 'mediator') {
            let cases = await mediator.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');
                const currentMediator = await mediator.findById(req.user._id);
                console.log(currentMediator)
                mediatorData.name = `${currentMediator.firstName} ${currentMediator.lastName} `;

            
                clientDetials.c2clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                clientDetials.c2email = CaseFound.MajorDataC2.mail
                clientDetials.c1clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                clientDetials.c1email = CaseFound.MajorDataC1.mail
                
              //   clientDetials.c2email = 'abdosamir023023@gmail.com'
                //clientDetials.c1email = 'abdosamir023023@gmail.com'

                companyDetails.companyName = mediatorCompanyData.companyId.companyName
                companyDetails.email = mediatorCompanyData.companyId.email;

                childNames=""
 
                //JSON.parse()
                let childrensArr = JSON.parse(CaseFound.client1data).children;
                if(childrensArr)
                {
                    if(childrensArr[0]) childNames+= childrensArr[0]['Child One'].firstChildFirstName
                
                    if(childrensArr[1]) childNames+=" and "+childrensArr[1]['Child Two'].secondChildFirstName
                    if(childrensArr[2]) childNames+=" and "+childrensArr[2]['Child Three'].thirdChildFirstName
                  
                    if(childrensArr[3]) childNames+=" and "+childrensArr[3]['Child Four'].forthChildFirstName
                    if(childrensArr[4]) childNames+=" and "+childrensArr[4]['Child Five'].fifthChildFirstName
                    if(childrensArr[5]) childNames+=" and "+childrensArr[5]['Child Six'].sixthChildFirstName
               
                }
                else{
                    childNames=" "
                }

           

                sendCIMMail(mediatorData, clientDetials, companyDetails , childNames);
                res.status(200).json({ "message": "CIM information mail has been  sent ... " })
            }
            else {
                res.status(400).json({ "message": "no case found ... " })
            }

        }

        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }

});

router.post('/sendProperty_Mail/:id', authMiddleware, async (req, res, next) => {

    let CaseFound;
    try {
 
        let companyDetails = {}, clientDetials = {}, mediatorData = {}

        if (req.userRole == 'company') {
            let cases = await Company.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {

                const currentComp = await Company.findById(req.user._id);
                const currentMediator = await Case.findById(req.params.id).populate('connectionData.mediatorID');
                mediatorData.name = `${currentMediator.connectionData.mediatorID.firstName} ${currentMediator.connectionData.mediatorID.lastName} `;

            
                clientDetials.c2clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                clientDetials.c2email = CaseFound.MajorDataC2.mail
                clientDetials.c1clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                clientDetials.c1email = CaseFound.MajorDataC1.mail
                
              //  clientDetials.c2email = 'abdosamir023023@gmail.com'
              // clientDetials.c1email = 'abdosamir023023@gmail.com'

                companyDetails.companyName = currentComp.companyName
                companyDetails.email = currentComp.email;

          

                sendPropertyMail(mediatorData, clientDetials, companyDetails);
                res.status(200).json({ "message": "CIM information mail has been  sent ... " })
            }
            else {
                res.status(400).json({ "message": "no case found ... " })
            }

        }
        else if (req.userRole == 'mediator') {
            let cases = await mediator.findById(req.user._id).populate('cases');
            for (let i = 0; i < cases.cases.length; i++) {
                if (cases.cases[i]._id == req.params.id) {

                    CaseFound = (cases.cases[i])
                }
            }
            if (CaseFound) {
                const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId');
                const currentMediator = await mediator.findById(req.user._id);
                console.log(currentMediator)
                mediatorData.name = `${currentMediator.firstName} ${currentMediator.lastName} `;

            
                clientDetials.c2clientName = `${CaseFound.MajorDataC2.fName} ${CaseFound.MajorDataC2.sName}`;
                clientDetials.c2email = CaseFound.MajorDataC2.mail
                clientDetials.c1clientName = `${CaseFound.MajorDataC1.fName} ${CaseFound.MajorDataC1.sName}`;
                clientDetials.c1email = CaseFound.MajorDataC1.mail
                
              //   clientDetials.c2email = 'abdosamir023023@gmail.com'
                //clientDetials.c1email = 'abdosamir023023@gmail.com'

                companyDetails.companyName = mediatorCompanyData.companyId.companyName
                companyDetails.email = mediatorCompanyData.companyId.email;

           

                sendPropertyMail(mediatorData, clientDetials, companyDetails);
                res.status(200).json({ "message": "Property mail has been  sent ... " })
            }
            else {
                res.status(400).json({ "message": "no case found ... " })
            }

        }

        else {
            res.status(400).json({ res: "there is an arror with getting case access for the user" })
        }



    } catch (err) {
        res.status(400).json(err.message)
    }

});



module.exports = router