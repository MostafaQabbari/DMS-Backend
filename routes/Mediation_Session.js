const express = require('express');
const router = express.Router();
const Case = require('../models/case');
const nodemailer = require("nodemailer")
const config = require("../config/config");
const mediator = require('../models/mediator');
const Company = require("../models/company");
const authMiddleware = require("../middleware/authMiddleware");

const getNowFormattedDate = require('../global/specialDateFormate');
const dateNow = require('../global/dateNow')
const fs = require('fs');
const path = require('path');
const stream = require("stream");
const { google } = require("googleapis");
const { PDFDocument , rgb } = require("pdf-lib");



const statisticFunctions = require("../global/statisticsFunctions");
const { dataform } = require('googleapis/build/src/apis/dataform');

const MailRecordFormToMed = function (mediatorData, caseData) {

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

  /*
mediatorData.email
mediatorData.name

caseData.caseReference
caseData.caseID
  */


     transporter.sendMail({
        from: config.companyEmail,
        to: mediatorData.email,
        subject: `Mediation Session Record Form for  ${caseData.caseReference} `,
        html: `<body>
        <div style=" text-align: left; ">
        <h1>Hello ${mediatorData.name}  </h1>
        <h3>Here is the session record form link for ${caseData.caseReference} case </h3>
        <a href="${config.baseUrlRecordSessionForm}/${config.RecordSessionForm}/${caseData.caseID}">${config.baseUrlRecordSessionForm}/${config.RecordSessionForm}/${caseData.caseID}</a>
        <p> Best Regards </p>
        <p>DMS's Team </p> 
        </div>
        </body>`,

  });

}

const sendMediationSession = function (reciever, compData, mediationRecord) {

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
  console.log("📢📢", mediationRecord.discussions[0]?.['Discussion One']?.firstAgendaPointDiscussed)
  let htmlBody = `<body style="text-align:left ; direction:ltr">
    <h1> Mediation Session Record  </h1>
    <h2> Submitted At </h2>
    <p>${mediationRecord.submittedDate}</p>

    <h2> What is the full name of Client 1? </h2>
    <p>${mediationRecord.clientData.clientOneFullName}</p>

    <h2> What is the full name of Client 2? </h2>
    <p>${mediationRecord.clientData.clientTwoFullName}</p>

    <h2> Name of the mediator </h2>
    <p>${mediationRecord.clientData.mediatorName}</p>

    <h2> Date of the session </h2>
    <p>${mediationRecord.clientData.sessionDate}</p>

    <h2>Type of case. </h2>
    <p>${mediationRecord.clientData.caseType}</p>
    
    <div style="display: ${mediationRecord.clientData.mediationSessionLocation ? 'block' : 'none'};">

    <h2>Mediation  location </h2>
    <p>${mediationRecord.clientData.mediationSessionLocation}</p>
    </div>


    <h2>Please specify location </h2>
    <p>${mediationRecord.clientData.specifyLocation}</p>


    <h2>Specify the mediation session number </h2>
    <p>${mediationRecord.clientData.mediationSessionNumber}</p>

    <h2>Length of session plus length of writing (in minutes) </h2>
    <p>${mediationRecord.clientData.sessionLength}</p>

    

    <div style="display: ${mediationRecord.keyFacts.clientsAgreedToAttendMediationChildAndFiance == 'Yes' ? 'block' : 'none'};">


    <h2>Do ${mediationRecord.clientData.clientOneFullName} and ${mediationRecord.clientData.clientTwoFullName} have any children? </h2>
    <p>${mediationRecord.keyFacts.clientsAgreedToAttendMediationChildAndFiance}</p>
  
    <h2>What is the full name of the first child?</h2>
    <p>${mediationRecord.keyFacts.children[0]?.['Child One'].firstChildFirstName}</p>
  
    <h2>What is ${mediationRecord.keyFacts.children[0]?.['Child One'].firstChildFirstName}’s date of birth?</h2>
    <p>${mediationRecord.keyFacts.children[0]?.['Child One'].firstChildDateOfBirth}</p>
  
   
    <h2> Do both participants have Parental Responsibility for ${mediationRecord.keyFacts.children[0]?.['Child One'].firstChildFirstName}</h2>
    <p>${mediationRecord.keyFacts.children[0]?.['Child One'].bothHaveParentalResponsibilityForFirstChild}</p>

    <div style="display: ${mediationRecord.keyFacts.children[0]?.['Child One'].firstChildParentalResponsibility ? 'block' : 'none'};">

  
    <h2> Who has parental resposibility for ${mediationRecord.keyFacts.children[0]?.['Child One'].firstChildFirstName}</h2>
    <p>${mediationRecord.keyFacts.children[0]?.['Child One'].firstChildParentalResponsibility}</p>
  
  </div>
    <h2>Do ${mediationRecord.clientData.clientOneFullName} and ${mediationRecord.clientData.clientTwoFullName} have a second child ? </h2>
    <p>${mediationRecord.keyFacts.children[0]?.['Child One'].secondChildCheck}</p>
  
  
  
    <div style="display: ${mediationRecord.keyFacts.children[0]?.['Child One'].secondChildCheck == 'Yes' ? 'block' : 'none'};">
  
    <h2>What is the full name of the second child?</h2>
    <p>${mediationRecord.keyFacts.children[1]?.['Child Two'].secondChildFullName}</p>
  
    <h2>What is ${mediationRecord.keyFacts.children[1]?.['Child Two'].secondChildFullName}’s date of birth?</h2>
    <p>${mediationRecord.keyFacts.children[1]?.['Child Two'].secondChildDateOfBirth}</p>
  
   
    <h2> Do both participants have Parental Responsibility for ${mediationRecord.keyFacts.children[1]?.['Child Two'].secondChildFullName}</h2>
    <p>${mediationRecord.keyFacts.children[1]?.['Child Two'].secondChildBothParentalResponsibility}</p>


   <div style="display: ${mediationRecord.keyFacts.children[1]?.['Child Two'].secondChildParentalResponsibility == 'Yes' ? 'block' : 'none'};">
  
    <h2> Who has parental resposibility for ${mediationRecord.keyFacts.children[1]?.['Child Two'].secondChildFullName}</h2>
    <p>${mediationRecord.keyFacts.children[1]?.['Child Two'].secondChildParentalResponsibility}</p>
    </div>
  
    <h2>Do ${mediationRecord.clientData.clientOneFullName} and ${mediationRecord.clientData.clientTwoFullName} have a third child ? </h2>
    <p>${mediationRecord.keyFacts.children[1]?.['Child Two'].thirdChildCheck}</p>
    
    </div>
  
  
    <div style="display: ${mediationRecord.keyFacts.children[1]?.['Child Two'].thirdChildCheck == 'Yes' ? 'block' : 'none'};">
  
    <h2>What is the full name of the third child?</h2>
    <p>${mediationRecord.keyFacts.children[2]?.['Child Three'].thirdChildFullName}</p>
  
    <h2>What is ${mediationRecord.keyFacts.children[2]?.['Child Three'].thirdChildFullName}’s date of birth?</h2>
    <p>${mediationRecord.keyFacts.children[2]?.['Child Three'].thirdChildDateOfBirth}</p>
  
   
    <h2> Do both participants have Parental Responsibility for ${mediationRecord.keyFacts.children[2]?.['Child Three'].thirdChildFullName}</h2>
    <p>${mediationRecord.keyFacts.children[2]?.['Child Three'].thirdChildBothParentalResponsibility}</p>
  

    <div style="display: ${mediationRecord.keyFacts.children[2]?.['Child Three'].thirdChildParentalResponsibility ? 'block' : 'none'};">

    <h2> Who has parental resposibility for ${mediationRecord.keyFacts.children[2]?.['Child Three'].thirdChildFullName}</h2>
    <p>${mediationRecord.keyFacts.children[2]?.['Child Three'].thirdChildParentalResponsibility}</p>
  </div>
  
    <h2>Do ${mediationRecord.clientData.clientOneFullName} and ${mediationRecord.clientData.clientTwoFullName} have a third child ? </h2>
    <p>${mediationRecord.keyFacts.children[2]?.['Child Three'].fourthChildCheck}</p>
    
    </div>
  
    <div style="display: ${mediationRecord.keyFacts.children[2]?.['Child Three'].fourthChildCheck == 'Yes' ? 'block' : 'none'};">
  
    <h2>What is the full name of the fourth child?</h2>
    <p>${mediationRecord.keyFacts.children[3]?.['Child Four'].fourthChildFullName}</p>
  
    <h2>What is ${mediationRecord.keyFacts.children[3]?.['Child Four'].fourthChildFullName}’s date of birth?</h2>
    <p>${mediationRecord.keyFacts.children[3]?.['Child Four'].fourthChildDateOfBirth}</p>
  
   
    <h2> Do both participants have Parental Responsibility for ${mediationRecord.keyFacts.children[3]?.['Child Four'].fourthChildFullName}</h2>
    <p>${mediationRecord.keyFacts.children[3]?.['Child Four'].fourthChildBothParentalResponsibility}</p>

    <div style="display: ${mediationRecord.keyFacts.children[3]?.['Child Four'].fourthChildParentalResponsibility ? 'block' : 'none'};">

  
    <h2> Who has parental resposibility for ${mediationRecord.keyFacts.children[3]?.['Child Four'].fourthChildFullName}</h2>
    <p>${mediationRecord.keyFacts.children[3]?.['Child Four'].fourthChildParentalResponsibility}</p>
  </div>
    
    </div>
  
  
  
    </div>
  
  
  
    <div style="display: ${mediationRecord.keyFacts.clientsAgreedToAttendMediationChildAndFiance == 'No' ? 'block' : 'none'};">
    
    <h2>Do ${mediationRecord.clientData.clientOneFullName} and ${mediationRecord.clientData.clientTwoFullName} have any children? </h2>
    <p>${mediationRecord.keyFacts.clientsAgreedToAttendMediationChildAndFiance}</p>
  
    </div>
  
    <div style="display: ${mediationRecord.keyFacts.clientsAgreedToAttendMediationChild ? 'block' : 'none'};">
  
    
  
    <h2>Do ${mediationRecord.clientData.clientOneFullName} and ${mediationRecord.clientData.clientTwoFullName}  agree to attend mediation to try and put together 
    arrangements to enable their
     child/children to spend time with them both and to propose a framework to allow them to parent the child/children in the future without conflict? </h2>
    <p>${mediationRecord.keyFacts.clientsAgreedToAttendMediationChild}</p>
  
    </div>
  
  
    <h2>Type of mediation</h2>
    <p>${mediationRecord.recordOfMattersDiscussed.mediationType}</p>
  
    <h2>Do ${mediationRecord.clientData.clientOneFullName} and ${mediationRecord.clientData.clientTwoFullName} agree to the Agreement to Mediate?</h2>
    <p>${mediationRecord.recordOfMattersDiscussed.clientsAgreedToMediate}</p>
  
  
  
  
    <div>
  
    <h2>Please list the agreed agenda points </h2>
    <p>${mediationRecord.recordOfMattersDiscussed.agendaListPoints}</p>
  
  
    <h2>First agenda point discussed </h2>
    <p>${mediationRecord.discussions[0]?.['Discussion One']?.firstAgendaPointDiscussed}</p>
  
    <h2>Issues identified </h2>
    <p>${mediationRecord.discussions[0]?.['Discussion One']?.firstAgendaIssuesIdentified}</p>
  
    <h2>Options discussed </h2>
    <p>${mediationRecord.discussions[0]?.['Discussion One']?.firstAgendaOptionsDiscussed}</p>
  
    <h2>Any agreements reached? </h2>
    <p>${mediationRecord.discussions[0]?.['Discussion One']?.firstAgendaAnyAgreementsReached}</p>
  
    <div style="display: ${mediationRecord.discussions[0]?.['Discussion One']?.firstAgendaAnyAgreementsReached == 'Yes' ? 'block' : 'none'};">
  
    <h2>Please bullet point any agreements reached </h2>
    <p>${mediationRecord.discussions[0]?.['Discussion One']?.firstAgendaAgreedBulletsPoints}</p>
  
    </div>
  
    <h2>Action points for the clients </h2>
    <p>${mediationRecord.discussions[0]?.['Discussion One']?.firstAgendaClientsActionPoints}</p>
  
    <h2>Is there a second agenda point?</h2>
    <p>${mediationRecord.discussions[0]?.['Discussion One']?.secondAgendaCheck}</p>
  
  
  
    </div>
  
  
    <div style="display: ${mediationRecord.discussions[0]?.['Discussion One']?.secondAgendaCheck == 'Yes' ? 'block' : 'none'};">
  
  
  
    <h2>Second agenda point discussed </h2>
    <p>${mediationRecord.discussions[1]?.['Discussion Two']?.secondAgendaPointDiscussed}</p>
  
    <h2>Issues identified </h2>
    <p>${mediationRecord.discussions[1]?.['Discussion Two']?.secondAgendaIssuesIdentified}</p>
  
    <h2>Options discussed </h2>
    <p>${mediationRecord.discussions[1]?.['Discussion Two']?.secondAgendaOptionsDiscussed}</p>
  
    <h2>Any agreements reached? </h2>
    <p>${mediationRecord.discussions[1]?.['Discussion Two']?.secondAgendaAnyAgreementsReached}</p>
  
    <div style="display: ${mediationRecord.discussions[1]?.['Discussion Two']?.secondAgendaAnyAgreementsReached == 'Yes' ? 'block' : 'none'};">
  
    <h2>Please bullet point any agreements reached </h2>
    <p>${mediationRecord.discussions[1]?.['Discussion Two']?.secondAgendaAgreedBulletsPoints}</p>
  
    </div>
  
    <h2>Action points for the clients </h2>
    <p>${mediationRecord.discussions[1]?.['Discussion Two']?.secondAgendaClientsActionPoints}</p>
  
    <h2>Is there a third agenda point?</h2>
    <p>${mediationRecord.discussions[1]?.['Discussion Two']?.thirdAgendaCheck}</p>
  
  
  
    </div>
  
  
  
  
  
    </div>
  
    <div style="display: ${mediationRecord.discussions[1]?.['Discussion Two']?.thirdAgendaCheck == 'Yes' ? 'block' : 'none'};">
  
  
  
    <h2>Third agenda point discussed </h2>
    <p>${mediationRecord.discussions[2]?.['Discussion Three']?.thirdAgendaPointDiscussed}</p>
  
    <h2>Issues identified </h2>
    <p>${mediationRecord.discussions[2]?.['Discussion Three']?.thirdAgendaIssuesIdentified}</p>
  
    <h2>Options discussed </h2>
    <p>${mediationRecord.discussions[2]?.['Discussion Three']?.thirdAgendaOptionsDiscussed}</p>
  
    <h2>Any agreements reached? </h2>
    <p>${mediationRecord.discussions[2]?.['Discussion Three']?.thirdAgendaAnyAgreementsReached}</p>
  
    <div style="display: ${mediationRecord.discussions[2]?.['Discussion Three']?.thirdAgendaAnyAgreementsReached == 'Yes' ? 'block' : 'none'};">
  
    <h2>Please bullet point any agreements reached </h2>
    <p>${mediationRecord.discussions[2]?.['Discussion Three']?.thirdAgendaAgreedBulletsPoints}</p>
  
    </div>
  
    <h2>Action points for the clients </h2>
    <p>${mediationRecord.discussions[2]?.['Discussion Three']?.thirdAgendaClientsActionPoints}</p>
  
    <h2>Is there a fourth agenda point?</h2>
    <p>${mediationRecord.discussions[2]?.['Discussion Three']?.fourthAgendaCheck}</p>
  
  
  
    </div>
  
    <div style="display: ${mediationRecord.discussions[2]?.['Discussion Three']?.fourthAgendaCheck == 'Yes' ? 'block' : 'none'};">
  
  
  
    <h2>Fourth agenda point discussed </h2>
    <p>${mediationRecord.discussions[3]?.['Discussion Four']?.fourthAgendaPointDiscussed}</p>
  
    <h2>Issues identified </h2>
    <p>${mediationRecord.discussions[3]?.['Discussion Four']?.fourthAgendaIssuesIdentified}</p>
  
    <h2>Options discussed </h2>
    <p>${mediationRecord.discussions[3]?.['Discussion Four']?.fourthAgendaOptionsDiscussed}</p>
  
    <h2>Any agreements reached? </h2>
    <p>${mediationRecord.discussions[3]?.['Discussion Four']?.fourthAgendaAnyAgreementsReached}</p>
  
    <div style="display: ${mediationRecord.discussions[3]?.['Discussion Four']?.fourthAgendaAnyAgreementsReached == 'Yes' ? 'block' : 'none'};">
  
    <h2>Please bullet point any agreements reached </h2>
    <p>${mediationRecord.discussions[3]?.['Discussion Four']?.fourthAgendaAgreedBulletsPoints}</p>
  
    </div>
  
    <h2>Action points for the clients </h2>
    <p>${mediationRecord.discussions[3]?.['Discussion Four']?.fourthAgendaClientsActionPoints}</p>
  
    <h2>Is there a fifth agenda point?</h2>
    <p>${mediationRecord.discussions[3]?.['Discussion Four']?.fifthAgendaCheck}</p>
  
  
  
    </div>
  
  
  
    <div style="display: ${mediationRecord.discussions[3]?.['Discussion Four']?.fifthAgendaCheck == 'Yes' ? 'block' : 'none'};">
  
  
  
    <h2>Fifth agenda point discussed </h2>
    <p>${mediationRecord.discussions[4]?.['Discussion Five']?.fifthAgendaPointDiscussed}</p>
  
    <h2>Issues identified </h2>
    <p>${mediationRecord.discussions[4]?.['Discussion Five']?.fifthAgendaIssuesIdentified}</p>
  
    <h2>Options discussed </h2>
    <p>${mediationRecord.discussions[4]?.['Discussion Five']?.fifthAgendaOptionsDiscussed}</p>
  
    <h2>Any agreements reached? </h2>
    <p>${mediationRecord.discussions[4]?.['Discussion Five']?.fifthAgendaAnyAgreementsReached}</p>
  
    <div style="display: ${mediationRecord.discussions[4]?.['Discussion Five']?.fifthAgendaAnyAgreementsReached == 'Yes' ? 'block' : 'none'};">
  
    <h2>Please bullet point any agreements reached </h2>
    <p>${mediationRecord.discussions[4]?.['Discussion Five']?.fifthAgendaAgreedBulletsPoints}</p>
  
    </div>
  
    <h2>Action points for the clients </h2>
    <p>${mediationRecord.discussions[4]?.['Discussion Five']?.fifthAgendaClientsActionPoints}</p>
  
    <h2>Is there a sixth agenda point?</h2>
    <p>${mediationRecord.discussions[4]?.['Discussion Five']?.sixthAgendaCheck}</p>
  
  
  
    </div>
  
  
  
  
    <div style="display: ${mediationRecord.discussions[4]?.['Discussion Five']?.sixthAgendaCheck == 'Yes' ? 'block' : 'none'};">
  
  
  
    <h2>Sixth agenda point discussed </h2>
    <p>${mediationRecord.discussions[5]?.['Discussion Six']?.sixthAgendaPointDiscussed}</p>
  
    <h2>Issues identified </h2>
    <p>${mediationRecord.discussions[5]?.['Discussion Six']?.sixthAgendaIssuesIdentified}</p>
  
    <h2>Options discussed </h2>
    <p>${mediationRecord.discussions[5]?.['Discussion Six']?.sixthAgendaOptionsDiscussed}</p>
  
    <h2>Any agreements reached? </h2>
    <p>${mediationRecord.discussions[5]?.['Discussion Six']?.sixthAgendaAnyAgreementsReached}</p>
  
    <div style="display: ${mediationRecord.discussions[5]?.['Discussion Six']?.sixthAgendaAnyAgreementsReached == 'Yes' ? 'block' : 'none'};">
  
    <h2>Please bullet point any agreements reached </h2>
    <p>${mediationRecord.discussions[5]?.['Discussion Six']?.sixthAgendaAgreedBulletsPoints}</p>
  
    </div>
  
    <h2>Action points for the clients </h2>
    <p>${mediationRecord.discussions[5]?.['Discussion Six']?.sixthAgendaClientsActionPoints}</p>
  
    <h2>Is there a seventh agenda point?</h2>
    <p>${mediationRecord.discussions[5]?.['Discussion Six']?.seventhAgendaCheck}</p>
  
  
  
    </div>
  
  
  
  
    <div style="display: ${mediationRecord.discussions[5]?.['Discussion Six']?.seventhAgendaCheck == 'Yes' ? 'block' : 'none'};">
  
  
  
    <h2>Seventh agenda point discussed </h2>
    <p>${mediationRecord.discussions[6]?.['Discussion Seven']?.seventhAgendaPointDiscussed}</p>
  
    <h2>Issues identified </h2>
    <p>${mediationRecord.discussions[6]?.['Discussion Seven']?.seventhAgendaIssuesIdentified}</p>
  
    <h2>Options discussed </h2>
    <p>${mediationRecord.discussions[6]?.['Discussion Seven']?.seventhAgendaOptionsDiscussed}</p>
  
    <h2>Any agreements reached? </h2>
    <p>${mediationRecord.discussions[6]?.['Discussion Seven']?.seventhAgendaAnyAgreementsReached}</p>
  
    <div style="display: ${mediationRecord.discussions[6]?.['Discussion Seven']?.seventhAgendaAnyAgreementsReached == 'Yes' ? 'block' : 'none'};">
  
    <h2>Please bullet point any agreements reached </h2>
    <p>${mediationRecord.discussions[6]?.['Discussion Seven']?.seventhAgendaAgreedBulletsPoints}</p>
  
    </div>
  
    <h2>Action points for the clients </h2>
    <p>${mediationRecord.discussions[6]?.['Discussion Seven']?.seventhAgendaClientsActionPoints}</p>
  
    <h2>Is there a eighth agenda point?</h2>
    <p>${mediationRecord.discussions[6]?.['Discussion Seven']?.eighthAgendaCheck}</p>
  
  
  
    </div>
  
  
  
    <div style="display: ${mediationRecord.discussions[6]?.['Discussion Seven']?.eighthAgendaCheck == 'Yes' ? 'block' : 'none'};">
  
  
  
    <h2>Eighth agenda point discussed </h2>
    <p>${mediationRecord.discussions[7]?.['Discussion Eight']?.eighthAgendaPointDiscussed}</p>
  
    <h2>Issues identified </h2>
    <p>${mediationRecord.discussions[7]?.['Discussion Eight']?.eighthAgendaIssuesIdentified}</p>
  
    <h2>Options discussed </h2>
    <p>${mediationRecord.discussions[7]?.['Discussion Eight']?.eighthAgendaOptionsDiscussed}</p>
  
    <h2>Any agreements reached? </h2>
    <p>${mediationRecord.discussions[7]?.['Discussion Eight']?.eighthAgendaAnyAgreementsReached}</p>
  
    <div style="display: ${mediationRecord.discussions[7]?.['Discussion Eight']?.eighthAgendaAnyAgreementsReached == 'Yes' ? 'block' : 'none'};">
  
    <h2>Please bullet point any agreements reached </h2>
    <p>${mediationRecord.discussions[7]?.['Discussion Eight']?.eighthAgendaAgreedBulletsPoints}</p>
  
    </div>
  
    <h2>Action points for the clients </h2>
    <p>${mediationRecord.discussions[7]?.['Discussion Eight']?.eighthAgendaClientsActionPoints}</p>
  
  
   
  
    </div>
    </div>
  
  
   <div style='text-align:left ; direction:ltr">
   <div style="display: ${mediationRecord.documentUpload.additionalDocumentsToUpload ? 'block' : 'none'};">
    <h2>Are there any additional documents to upload?</h2>
    <p>${mediationRecord.documentUpload.additionalDocumentsToUpload}</p>
  </div>
  
    <div style="display: ${mediationRecord.NextSteps.isFurtherSessionPlanned ? 'block' : 'none'};">
  
    <h2>Has a further mediation session been planned?</h2>
    <p>${mediationRecord.NextSteps.isFurtherSessionPlanned}</p>
    </div>
  
  
    <div style="display: ${mediationRecord.NextSteps.isFurtherSessionPlanned == 'Yes' ? 'block' : 'none'};">
  
    <h2>Issues for discussion in next session?</h2>
    <p>${mediationRecord.NextSteps.nextSessionIssues}</p>
  
    </div>
  

    <div style="display: ${mediationRecord.NextSteps.mediationFinishReason ? 'block' : 'none'};">
  
    <h2>What is the reason mediation has been finished?</h2>
    <p>${mediationRecord.NextSteps.mediationFinishReason}</p>
  
    </div>
  
  
  
    <div style="display: ${mediationRecord.NextSteps.bothClientsAgreed ? 'block' : 'none'};">
  
    <h2>Have both clients agreed on a date and time to come back to mediation?</h2>
    <p>${mediationRecord.NextSteps.bothClientsAgreed}</p>
  
    </div>
  
  
  
    <div style="display: ${mediationRecord.NextSteps.isC100OrFormA ? 'block' : 'none'};">
  
    <h2>Do you want to upload the C100 and/or Form A?</h2>
    <p>${mediationRecord.NextSteps.isC100OrFormA}</p>
  
    </div>
  
  
    <div style="display: ${mediationRecord.NextSteps.returnToMediationDate ? 'block' : 'none'};">
  
    <h2>What is the date they are returning to mediation?</h2>
    <p>${mediationRecord.NextSteps.returnToMediationDate}</p>
  
    </div>
  
    <div style="display: ${mediationRecord.NextSteps.appointmentTime ? 'block' : 'none'};">
  
    <h2>What time is their appointment?</h2>
    <p>${mediationRecord.NextSteps.appointmentTime}</p>
  
    </div>
    <div style="display: ${mediationRecord.NextSteps.isTwoClientWantCopy ? 'block' : 'none'};">
  
    <h2> Do both clients want the session record emailing to them?</h2>
    <p>${mediationRecord.NextSteps.isTwoClientWantCopy}</p>
  
    </div>
  
    <div style="display: ${mediationRecord.NextSteps.isMediatorWantCopy ? 'block' : 'none'};">
  
    <h2>Do you as the mediator want a copy of this record sending to you?</h2>
    <p>${mediationRecord.NextSteps.isMediatorWantCopy}</p>
  
    </div>
  
  
    <div style="display: ${mediationRecord.NextSteps['MediatorsComments'] ? 'block' : 'none'};">
  
    <h2> Mediator's comments (these are not released to the clients and won't appear in the mediation session record)</h2>
    <p>${mediationRecord.NextSteps['MediatorComments']}</p>
  
    </div>
  
  
    <div style="display: ${mediationRecord.NextSteps.clientOneEmail ? 'block' : 'none'};">
  
    <h2>Input email address of ${mediationRecord.clientData.clientOneFullName}</h2>
    <p>${mediationRecord.NextSteps.clientOneEmail}</p>
  
    </div>
  
    <div style="display: ${mediationRecord.NextSteps.clientTwoEmail ? 'block' : 'none'};">
  
    <h2>Input email address of ${mediationRecord.clientData.clientTwoFullName}</h2>
    <p>${mediationRecord.NextSteps.clientTwoEmail}</p>
    </div>
    <div style="display: ${mediationRecord.NextSteps.mediatorEmail ? 'block' : 'none'};">
    <h2>Input email address of mediator</h2>
    <p>${mediationRecord.NextSteps.mediatorEmail}</p>
    </div>
    <p> Best Regards </p>
    <p> ${compData.name} Team </p>
    </div>
    </div>
    </body>`

   transporter.sendMail({
    from: config.companyEmail,
    to: reciever,
    subject: `You have a new submission of Mediation Session Record`,
    html: htmlBody,

  });

}






router.patch("/addMediationRecord/:id", async (req, res) => {
  try {


  let mediationRecord = req.body;
  let mediatorOfTheCase = req.body.clientData.mediatorName
  const StringfyData = JSON.stringify(mediationRecord);

  

  // // Call the function
  // await generateMediationSessionRecord(mediationRecord)
  // .then(pdfBytes => {
  // fs.writeFileSync('mediation_session_record.pdf', pdfBytes);
  // })
  // .catch(error => {
  // console.error('Error:', error);
  // });

  // // Call the function
  // generateMediationSessionRecord(mediationRecord)
  //   .then(pdfBytes => {
  //     fs.writeFileSync('mediation_session_record2.pdf', pdfBytes);

  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });
    mediationRecord.submittedDate = getNowFormattedDate();

    await createMediationRecordUpload(mediationRecord  , req.params.id , mediationRecord.submittedDate);

    const currentCompData = await Case.findById(req.params.id).populate('connectionData.companyID');
    let compData = {}
    compData.name = currentCompData.connectionData.companyID.companyName;
    /*
            reciever = mediationRecord.NextSteps.mediatorEmail;
            reciever = mediationRecord.NextSteps.clientTwoEmail;
            reciever = mediationRecord.NextSteps.clientOneEmail;
    */

  //  console.log("🤦‍♂️Med", mediationRecord.NextSteps.mediatorEmail)
    sendMediationSession(mediationRecord.NextSteps.mediatorEmail, compData, mediationRecord)

   // console.log("😒C1", mediationRecord.NextSteps.clientOneEmail)
    sendMediationSession(mediationRecord.NextSteps.clientOneEmail, compData, mediationRecord)

    if (mediationRecord.NextSteps.isTwoClientWantCopy == 'Yes') {
   //     console.log("🤦‍♂️C2", mediationRecord.NextSteps.clientTwoEmail)
        sendMediationSession(mediationRecord.NextSteps.clientTwoEmail, compData, mediationRecord)
    }





    if (req.body.NextSteps.isFurtherSessionPlanned == "Yes") {

        await Case.findByIdAndUpdate(req.params.id, {
            $inc: { mediationSessionsNo: 1 }
        })
        const updatedCase = await Case.findById(req.params.id);
        console.log(updatedCase.mediationSessionsNo)

        let statusRemider = {
            reminderID: `${updatedCase._id}-statusRemider`,
            reminderTitle: `${updatedCase.Reference}-Mediation Session ${updatedCase.mediationSessionsNo}`,
            startDate: dateNow()
        }

        await Case.findByIdAndUpdate(req.params.id, {
            $push: { mediationRecords: StringfyData },
            $set: {
                'Reminders.statusRemider': statusRemider
            }, status: `Mediation Session ${updatedCase.mediationSessionsNo}` ,mediatorOfTheCase
        })




    }

    else if (req.body.NextSteps.isFurtherSessionPlanned == "No" &&
        req.body.NextSteps.mediationFinishReason == "B - Mediation broken down/no longer suitable"
    ) {

        let statusRemider = {
            reminderID: `${updatedCase._id}-statusRemider`,
            reminderTitle: `${updatedCase.Reference}-Broken`,
            startDate: dateNow()
        }

        await Case.findByIdAndUpdate(req.params.id, {
            $push: { mediationRecords: StringfyData },
            $set: {
                'Reminders.statusRemider': statusRemider
            }, status: `Broken`, closed: true,mediatorOfTheCase
        })

    }


    else if (req.body.NextSteps.isFurtherSessionPlanned == "No" &&
        req.body.NextSteps.mediationFinishReason == "A - All/Some matters agreed"
    ) {

        let statusRemider = {
            reminderID: `${updatedCase._id}-statusRemider`,
            reminderTitle: `${updatedCase.Reference}-Agreed`,
            startDate: dateNow()
        }

        await Case.findByIdAndUpdate(req.params.id, {
            $push: { mediationRecords: StringfyData },
            $set: {
                'Reminders.statusRemider': statusRemider
            }, status: `Agreed`, closed: true,mediatorOfTheCase
        })

    }
    else if (req.body.NextSteps.isFurtherSessionPlanned == "No" &&
        req.body.NextSteps.mediationFinishReason == "C - Successful - Parenting plan to be written" ||
        req.body.NextSteps.mediationFinishReason == "P - Successful - MOU to be written" ||
        req.body.NextSteps.mediationFinishReason == "S - Successful - Most matters agreed and/or PP and/or MOU to be written"
    ) {

        let statusRemider = {
            reminderID: `${updatedCase._id}-statusRemider`,
            reminderTitle: `${updatedCase.Reference}-Successful`,
            startDate: dateNow()
        }

        await Case.findByIdAndUpdate(req.params.id, {
            $push: { mediationRecords: StringfyData },
            $set: {
                'Reminders.statusRemider': statusRemider
            }, status: `Successful`, closed: true,mediatorOfTheCase
        })

    }


    let updateCase = await Case.findById(req.params.id);
    let MedSession_Statistics = statisticFunctions.MedSession_Statistics(mediationRecord, updateCase);
    const targetComp = await Case.findById(req.params.id).populate('connectionData.companyID');
    const targetCompID = targetComp.connectionData.companyID._id;
    const stringfyStatiscs = JSON.stringify(MedSession_Statistics)
    await Company.findByIdAndUpdate(targetCompID, {
        $push: { statistics: stringfyStatiscs }
    })

    res.status(200).json({ "message": "Mediation session record has been added" })




  } catch (err) {
      res.status(400).json(err.message)
  }


});


//this function create pdf and folder and then upload it to that google drive folder 
async function createMediationRecordUpload(data, caseID ,subDate) {
  try {

    const pdfDoc = await PDFDocument.create();
    let pages = pdfDoc.getPages;
    let pageNumber = 0;
    const pageHeight = 841.89;
    pages[pageNumber] = pdfDoc.addPage();
    // console.log(pages[pageNumber])
    
    const BoldFont = await pdfDoc.embedFont('Helvetica-Bold');
    const font = await pdfDoc.embedFont('Helvetica');
    
    // const getLinesNumber = (string) => {
    //   if (string === undefined || string === null) {
    //     return 0;
    //   }
    //   return string.length / 35;
    // }
  
    const questionsAndAnswers = [
      { question: 'Submitted At', answer: subDate},
      { question: 'What is the full name of Client 1?', answer: data.clientData.clientOneFullName },
      { question: 'What is the full name of Client 2?', answer: data.clientData.clientTwoFullName },
      { question: 'Name of the mediator', answer: data.clientData.mediatorName },
      { question: 'Date of the session', answer: data.clientData.sessionDate },
      { question: 'Type of case.', answer: data.clientData.caseType},
      { question: 'Please specify location', answer: data.clientData.specifyLocation },
      { question: 'Specify the mediation session number', answer: data.clientData.mediationSessionNumber },
      { question: 'Length of session plus length of writing (in minutes)', answer: data.clientData.sessionLength },
      { question: `Do ${data.clientData.clientOneFullName} and ${data.clientData.clientTwoFullName} have any children?`, answer: 'Yes' },
      
      { question: 'What is the full name of the first child?', answer: data.keyFacts.children[0]?.['Child One'].firstChildFirstName},
      { question: `What is ${data.keyFacts.children[0]?.['Child One'].firstChildFirstName}’s date of birth?`, answer: data.keyFacts.children[0]?.['Child One'].firstChildDateOfBirth },
      { question: `Do both participants have Parental Responsibility for ${data.keyFacts.children[0]?.['Child One'].firstChildFirstName}?`, answer: data.keyFacts.children[0]?.['Child One'].bothHaveParentalResponsibilityForFirstChild },
      { question: `Who has parental resposibility for ${data.keyFacts.children[0]?.['Child One'].firstChildFullName}?`, answer: data.keyFacts.children[0]?.['Child One'].firstChildParentalResponsibility },
      { question: `Do ${data.clientData.clientOneFullName} and ${data.clientData.clientTwoFullName} have a second child?`, answer: data.keyFacts.children[0]?.['Child One'].secondChildCheck },
     
      { question: 'What is the full name of the second child?', answer: data.keyFacts.children[1]?.['Child Two'].secondChildFullName },
      { question: `What is ${data.keyFacts.children[1]?.['Child Two'].secondChildFullName}’s date of birth?`, answer: data.keyFacts.children[1]?.['Child Two'].secondChildDateOfBirth},
      { question: `Do both participants have Parental Responsibility for ${data.keyFacts.children[1]?.['Child Two'].secondChildFullName}?`, answer: data.keyFacts.children[1]?.['Child Two'].secondChildBothParentalResponsibility },
      { question: `Who has parental resposibility for ${data.keyFacts.children[1]?.['Child Two'].secondChildFullName}?`, answer: data.keyFacts.children[1]?.['Child Two'].secondChildParentalResponsibility },
      { question: `Do ${data.clientData.clientOneFullName} and ${data.clientData.clientTwoFullName} have a third child ?`, answer: data.keyFacts.children[1]?.['Child Two'].thirdChildCheck },

      { question: 'What is the full name of the third child?', answer: data.keyFacts.children[2]?.['Child Three'].thirdChildFullName},
      { question: `What is ${data.keyFacts.children[2]?.['Child Three'].thirdChildFullName}’s date of birth?`, answer: data.keyFacts.children[2]?.['Child Three'].thirdChildDateOfBirth },
      { question: `Do both participants have Parental Responsibility for ${data.keyFacts.children[2]?.['Child Three'].thirdChildFullName}?`, answer: data.keyFacts.children[2]?.['Child Three'].bothHaveParentalResponsibilityForFirstChild },
      { question: `Who has parental resposibility for ${data.keyFacts.children[2]?.['Child Three'].thirdChildFullName}?`, answer: data.keyFacts.children[2]?.['Child Three'].thirdChildParentalResponsibility },
      { question: `Do ${data.clientData.clientOneFullName} and ${data.clientData.clientTwoFullName} have a forth child?`, answer: data.keyFacts.children[2]?.['Child Three'].fourthChildCheck },

      { question: 'What is the full name of the forth child?', answer: data.keyFacts.children[3]?.['Child Four'].fourthChildFullName},
      { question: `What is ${data.keyFacts.children[3]?.['Child Four'].fourthChildFullName}’s date of birth?`, answer: data.keyFacts.children[3]?.['Child Four'].fourthChildDateOfBirth },
      { question: `Do both participants have Parental Responsibility for ${data.keyFacts.children[3]?.['Child Four'].fourthChildFullName}?`, answer: data.keyFacts.children[0]?.['Child Four'].fourthChildBothParentalResponsibility },
      { question: `Who has parental resposibility for ${data.keyFacts.children[3]?.['Child Four'].fourthChildFullName}?`, answer: data.keyFacts.children[3]?.['Child Four'].fourthChildParentalResponsibility },

     
      
      
      { question: `Do ${data.clientData.clientOneFullName} and ${data.clientData.clientTwoFullName}  agree to attend mediation to try and put together arrangements to enable their child/children to spend time with them both and to propose a framework to allow them to parent the child/children in the future without conflict?`, answer: data.keyFacts.clientsAgreedToAttendMediationChild },
      { question: 'Type of mediation', answer: data.recordOfMattersDiscussed.mediationType},
      { question: `Do ${data.clientData.clientOneFullName} and ${data.clientData.clientTwoFullName} agree to the Agreement to Mediate?`, answer: 'Yes' },
      { question: 'Please list the agreed agenda points', answer: data.recordOfMattersDiscussed.agendaListPoints },
     
      { question: 'First agenda point discussed.', answer: data.discussions[0]?.['Discussion One']?.firstAgendaPointDiscussed },
      { question: 'Issues identified', answer: data.discussions[0]?.['Discussion One']?.firstAgendaIssuesIdentified },
      { question: 'Options discussed', answer: data.discussions[0]?.['Discussion One']?.firstAgendaOptionsDiscussed},
      { question: 'Any agreements reached?', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAnyAgreementsReached },
      { question: 'Please bullet point any agreements reached ', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAgreedBulletsPoints},
      { question: 'Action points for the clients', answer: data.discussions[0]?.['Discussion One']?.firstAgendaClientsActionPoints },
      { question: 'Is there a second agenda point?', answer: data.discussions[0]?.['Discussion One']?.secondAgendaCheck },
      
      { question: 'Second agenda point discussed.', answer: data.discussions[1]?.['Discussion Two']?.firstAgendaPointDiscussed },
      { question: 'Issues identified', answer: data.discussions[1]?.['Discussion Two']?.firstAgendaIssuesIdentified },
      { question: 'Options discussed', answer: data.discussions[1]?.['Discussion Two']?.firstAgendaOptionsDiscussed},
      { question: 'Any agreements reached?', answer: data.discussions[1]?.['Discussion Two']?.firstAgendaAnyAgreementsReached },
      { question: 'Please bullet point any agreements reached ', answer: data.discussions[1]?.['Discussion Two']?.firstAgendaAgreedBulletsPoints},
      { question: 'Action points for the clients', answer: data.discussions[1]?.['Discussion Two']?.firstAgendaClientsActionPoints },
      { question: 'Is there a third agenda point?', answer: data.discussions[1]?.['Discussion Two']?.secondAgendaCheck },

      { question: 'Third agenda point discussed.', answer: data.discussions[2]?.['Discussion Three']?.firstAgendaPointDiscussed },
      { question: 'Issues identified', answer: data.discussions[2]?.['Discussion Three']?.firstAgendaIssuesIdentified },
      { question: 'Options discussed', answer: data.discussions[2]?.['Discussion Three']?.firstAgendaOptionsDiscussed},
      { question: 'Any agreements reached?', answer: data.discussions[2]?.['Discussion Three']?.firstAgendaAnyAgreementsReached },
      { question: 'Please bullet point any agreements reached ', answer: data.discussions[2]?.['Discussion Three']?.firstAgendaAgreedBulletsPoints},
      { question: 'Action points for the clients', answer: data.discussions[2]?.['Discussion Three']?.firstAgendaClientsActionPoints },
      { question: 'Is there a forth agenda point?', answer: data.discussions[2]?.['Discussion Three']?.secondAgendaCheck },
    
      { question: 'Forth agenda point discussed.', answer: data.discussions[3]?.['Discussion Four']?.firstAgendaPointDiscussed },
      { question: 'Issues identified', answer: data.discussions[3]?.['Discussion Four']?.firstAgendaIssuesIdentified },
      { question: 'Options discussed', answer: data.discussions[3]?.['Discussion Four']?.firstAgendaOptionsDiscussed},
      { question: 'Any agreements reached?', answer: data.discussions[3]?.['Discussion Four']?.firstAgendaAnyAgreementsReached },
      { question: 'Please bullet point any agreements reached ', answer: data.discussions[3]?.['Discussion Four']?.firstAgendaAgreedBulletsPoints},
      { question: 'Action points for the clients', answer: data.discussions[3]?.['Discussion Four']?.firstAgendaClientsActionPoints },
      { question: 'Is there a fifth agenda point?', answer: data.discussions[3]?.['Discussion Four']?.secondAgendaCheck },
    
    
      { question: 'Fifth agenda point discussed.', answer: data.discussions[4]?.['Discussion Five']?.firstAgendaPointDiscussed },
      { question: 'Issues identified', answer: data.discussions[4]?.['Discussion Five']?.firstAgendaIssuesIdentified },
      { question: 'Options discussed', answer: data.discussions[4]?.['Discussion Five']?.firstAgendaOptionsDiscussed},
      { question: 'Any agreements reached?', answer: data.discussions[4]?.['Discussion Five']?.firstAgendaAnyAgreementsReached },
      { question: 'Please bullet point any agreements reached ', answer: data.discussions[4]?.['Discussion Five']?.firstAgendaAgreedBulletsPoints},
      { question: 'Action points for the clients', answer: data.discussions[4]?.['Discussion Five']?.firstAgendaClientsActionPoints },
      { question: 'Is there a sixth agenda point?', answer: data.discussions[4]?.['Discussion Five']?.secondAgendaCheck },
    
      { question: 'Sixth agenda point discussed.', answer: data.discussions[5]?.['Discussion Six']?.firstAgendaPointDiscussed },
      { question: 'Issues identified', answer: data.discussions[5]?.['Discussion Six']?.firstAgendaIssuesIdentified },
      { question: 'Options discussed', answer: data.discussions[5]?.['Discussion Six']?.firstAgendaOptionsDiscussed},
      { question: 'Any agreements reached?', answer: data.discussions[5]?.['Discussion Six']?.firstAgendaAnyAgreementsReached },
      { question: 'Please bullet point any agreements reached ', answer: data.discussions[5]?.['Discussion Six']?.firstAgendaAgreedBulletsPoints},
      { question: 'Action points for the clients', answer: data.discussions[5]?.['Discussion Six']?.firstAgendaClientsActionPoints },
      { question: 'Is there a seventh agenda point?', answer: data.discussions[5]?.['Discussion Six']?.secondAgendaCheck },

      { question: 'Seveth agenda point discussed.', answer: data.discussions[6]?.['Discussion Seven']?.firstAgendaPointDiscussed },
      { question: 'Issues identified', answer: data.discussions[6]?.['Discussion Seven']?.firstAgendaIssuesIdentified },
      { question: 'Options discussed', answer: data.discussions[6]?.['Discussion Seven']?.firstAgendaOptionsDiscussed},
      { question: 'Any agreements reached?', answer: data.discussions[6]?.['Discussion Seven']?.firstAgendaAnyAgreementsReached },
      { question: 'Please bullet point any agreements reached ', answer: data.discussions[6]?.['Discussion Seven']?.firstAgendaAgreedBulletsPoints},
      { question: 'Action points for the clients', answer: data.discussions[6]?.['Discussion Seven']?.firstAgendaClientsActionPoints },
      { question: 'Is there a eighth agenda point?', answer: data.discussions[6]?.['Discussion Seven']?.secondAgendaCheck },

      { question: 'Eighth agenda point discussed.', answer: data.discussions[7]?.['Discussion Eight']?.firstAgendaPointDiscussed },
      { question: 'Issues identified', answer: data.discussions[7]?.['Discussion Eight']?.firstAgendaIssuesIdentified },
      { question: 'Options discussed', answer: data.discussions[7]?.['Discussion Eight']?.firstAgendaOptionsDiscussed},
      { question: 'Any agreements reached?', answer: data.discussions[7]?.['Discussion Eight']?.firstAgendaAnyAgreementsReached },
      { question: 'Please bullet point any agreements reached ', answer: data.discussions[7]?.['Discussion Eight']?.firstAgendaAgreedBulletsPoints},
      { question: 'Action points for the clients', answer: data.discussions[7]?.['Discussion Eight']?.firstAgendaClientsActionPoints },

      
      { question: 'Are there any additional documents to upload?', answer: data.documentUpload.additionalDocumentsToUpload },
      { question: 'Has a further mediation session been planned?', answer: data.NextSteps.isFurtherSessionPlanned },
      { question: 'Issues for discussion in next session?', answer: data.NextSteps.nextSessionIssues},
      { question: 'What is the reason mediation has been finished?', answer: data.NextSteps.mediationFinishReason },
      { question: 'Have both clients agreed on a date and time to come back to mediation?', answer: data.NextSteps.bothClientsAgreed},
      { question: 'Do you want to upload the C100 and/or Form A?', answer: data.NextSteps.isC100OrFormA },
      { question: 'What is the date they are returning to mediation?', answer: data.NextSteps.returnToMediationDate },
      
      { question: 'What time is their appointment?', answer: data.NextSteps.appointmentTime },
      { question: 'Do both clients want the session record emailing to them?', answer: data.NextSteps.isTwoClientWantCopy},
      { question: 'Do you as the mediator want a copy of this record sending to you?', answer: data.NextSteps.isMediatorWantCopy },
      { question: `Input email address of ${data.clientData.clientOneFullName}`, answer: data.NextSteps.clientOneEmail },
      { question: 'Input email address of mediator', answer: data.NextSteps.mediatorEmail },
      
    ];
    
        
        const startX = 50;
        let currentY = pageHeight - 50;
        const questionWidth = 500; // Adjust the width as needed
  
  
    //     for (const { question, answer } of questionsAndAnswers) {
  
        
  
    //       const validQuestion = question || ''; 
    //       const validAnswer = answer  ||  ''; 
        
    //       currentY = drawTextBlock(pages[pageNumber], validQuestion, startX, currentY, BoldFont, questionWidth, 25);
        
  
    //     // Additional space between Question and Answer
    //       const gapBetweenQA = 15;
    //       currentY -= gapBetweenQA;
  
    //     if (answer) {
    //       currentY = drawTextBlock(pages[pageNumber], validAnswer , startX, currentY, font, questionWidth, 25);
    //     }
  
    //     // Additional space between this Q&A and the next
    //     const gapBetweenBlocks = 20;
    //     currentY -= gapBetweenBlocks;
  
     
  
    //   // Move to the next page if necessary
    //   if (currentY <= 100) {
  
    //     // Add a new page and reset currentY
    //     pageNumber += 1;
    //     currentY = pageHeight - 50;
    //     pages[pageNumber] = pdfDoc.addPage();
  
    //     currentY -= 20;
    //   }
    // }
    
    for (const { question, answer } of questionsAndAnswers) {
      const validQuestion = question || '';
      const validAnswer = answer || '';
    
      // Check if the answer is not an empty string before drawing
      if (validAnswer.trim() !== '') {
        currentY = drawTextBlock(pages[pageNumber], validQuestion, startX, currentY, BoldFont, questionWidth, 25);
    
        // Additional space between Question and Answer
        const gapBetweenQA = 15;
        currentY -= gapBetweenQA;
    
        currentY = drawTextBlock(pages[pageNumber], validAnswer, startX, currentY, font, questionWidth, 25);

        // Additional space between this Q&A and the next
        const gapBetweenBlocks = 25;
        currentY -= gapBetweenBlocks;
      }
    

    
      // Move to the next page if necessary
      if (currentY <= 100) {
        // Add a new page and reset currentY
        pageNumber += 1;
        currentY = pageHeight - 50;
        pages[pageNumber] = pdfDoc.addPage();
    
        currentY -= 20;
      }
    }
    


    const pdfBytes = await pdfDoc.save();

    const currentCase = await Case.findById(caseID);

    const companyData = await Case.findById(currentCase._id).populate('connectionData.companyID');

    const sharingGmail = companyData.connectionData.companyID.sharingGmail;

    const folderId = currentCase.folderID;

    // console.log(folderId);
    // console.log(sharingGmail);


    const auth = await google.auth.getClient({

      keyFile: config.credentialFile1,

      scopes: ['https://www.googleapis.com/auth/drive'], // Scopes required for accessing Google Drive
    });



    const drive = google.drive({ version: "v3", auth });

    // Create a readable stream from the PDF bytes
    const readableStream = new stream.Readable({
      read() {
        this.push(pdfBytes);
        this.push(null);
      },
    });

    // Upload the PDF to the created folder
    const fileMetadata = {
      name: `"MediationSession.pdf"`,
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



    // Call the function with the folder ID and personal account email
    await shareWithPersonalAccount(folderId, sharingGmail);//the gmail sharing account that belong to the company
    //sharingGmail || "mkabary8@gmail.com"
    console.log("PDF created and uploaded successfully");
  } catch (error) {
    console.error("Error creating PDF and uploading to Google Drive:", error);
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


// async function generateMediationSessionRecord(data) {
//   const pdfDoc = await PDFDocument.create();
//     let pages = pdfDoc.getPages;
//     let pageNumber = 0;
//     const pageHeight = 841.89;
//     pages[pageNumber] = pdfDoc.addPage();
//     // console.log(pages[pageNumber])
    
//     const BoldFont = await pdfDoc.embedFont('Helvetica-Bold');
//     const font = await pdfDoc.embedFont('Helvetica');
    
//     // const getLinesNumber = (string) => {
//     //   if (string === undefined || string === null) {
//     //     return 0;
//     //   }
//     //   return string.length / 35;
//     // }
  
//     const questionsAndAnswers = [
//       { question: 'Submitted At', answer: data.submittedDate},
//       { question: 'What is the full name of Client 1?', answer: data.clientData.clientOneFullName },
//       { question: 'What is the full name of Client 2?', answer: data.clientData.clientTwoFullName },
//       { question: 'Name of the mediator', answer: data.clientData.mediatorName },
//       { question: 'Date of the session', answer: data.clientData.sessionDate },
//       { question: 'Type of case.', answer: data.clientData.caseType},
//       { question: 'Please specify location', answer: data.clientData.specifyLocation },
//       { question: 'Specify the mediation session number', answer: data.clientData.mediationSessionNumber },
//       { question: 'Length of session plus length of writing (in minutes)', answer: data.clientData.sessionLength },
//       { question: `Do ${data.clientData.clientOneFullName} and ${data.clientData.clientTwoFullName} have any children?`, answer: 'Yes' },
      
//       { question: 'What is the full name of the first child?', answer: data.keyFacts.children[0]?.['Child One'].firstChildFirstName},
//       { question: `What is ${data.keyFacts.children[0]?.['Child One'].firstChildFirstName}’s date of birth?`, answer: data.keyFacts.children[0]?.['Child One'].firstChildDateOfBirth },
//       { question: `'Do both participants have Parental Responsibility for ${data.keyFacts.children[0]?.['Child One'].firstChildFirstName}?'`, answer: data.keyFacts.children[0]?.['Child One'].bothHaveParentalResponsibilityForFirstChild },
//       { question: `'Do both participants have Parental Responsibility for ${data.keyFacts.children[0]?.['Child One'].firstChildFirstName}?'`, answer: data.keyFacts.children[0]?.['Child One'].bothHaveParentalResponsibilityForFirstChild },
//       { question: `'Do ${data.clientData.clientOneFullName} and ${data.clientData.clientTwoFullName} have a second child?'`, answer: data.keyFacts.children[0]?.['Child One'].secondChildCheck },
     
//       { question: 'What is the full name of the second child?', answer: data.keyFacts.children[1]?.['Child Two'].secondChildFullName },
//       { question: `'What is ${data.keyFacts.children[1]?.['Child Two'].secondChildFullName}’s date of birth?'`, answer: data.keyFacts.children[1]?.['Child Two'].secondChildDateOfBirth},
//       { question: `Do both participants have Parental Responsibility for ${data.keyFacts.children[1]?.['Child Two'].secondChildFullName}?`, answer: 'Yes' },
//       { question: `Who has parental resposibility for ${data.keyFacts.children[1]?.['Child Two'].secondChildFullName}?`, answer: data.keyFacts.children[1]?.['Child Two'].secondChildParentalResponsibility },
//       { question: `Do ${data.clientData.clientOneFullName} and ${data.clientData.clientTwoFullName} have a third child ?`, answer: data.keyFacts.children[1]?.['Child Two'].thirdChildCheck },
      
//       { question: `Do ${data.clientData.clientOneFullName} and ${data.clientData.clientTwoFullName}  agree to attend mediation to try and put together arrangements to enable their child/children to spend time with them both and to propose a framework to allow them to parent the child/children in the future without conflict?`, answer: data.keyFacts.clientsAgreedToAttendMediationChild },
//       { question: 'Type of mediation', answer: data.recordOfMattersDiscussed.mediationType},
//       { question: `Do ${data.clientData.clientOneFullName} and ${data.clientData.clientTwoFullName} agree to the Agreement to Mediate?`, answer: 'Yes' },
//       { question: 'Please list the agreed agenda points', answer: data.recordOfMattersDiscussed.agendaListPoints },
     
//       { question: 'First agenda point discussed.', answer: data.discussions[0]?.['Discussion One']?.firstAgendaPointDiscussed },
//       { question: 'Issues identified', answer: data.discussions[0]?.['Discussion One']?.firstAgendaIssuesIdentified },
//       { question: 'Options discussed', answer: data.discussions[0]?.['Discussion One']?.firstAgendaOptionsDiscussed},
//       { question: 'Any agreements reached?', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAnyAgreementsReached },
//       { question: 'Please bullet point any agreements reached ', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAgreedBulletsPoints},
//       { question: 'Action points for the clients', answer: data.discussions[0]?.['Discussion One']?.firstAgendaClientsActionPoints },
//       { question: 'Is there a second agenda point?', answer: data.discussions[0]?.['Discussion One']?.secondAgendaCheck },
      
//       { question: 'Second agenda point discussed.', answer: data.discussions[1]?.['Discussion Two']?.firstAgendaPointDiscussed },
//       { question: 'Issues identified', answer: data.discussions[1]?.['Discussion Two']?.firstAgendaIssuesIdentified },
//       { question: 'Options discussed', answer: data.discussions[1]?.['Discussion Two']?.firstAgendaOptionsDiscussed},
//       { question: 'Any agreements reached?', answer: data.discussions[1]?.['Discussion Two']?.firstAgendaAnyAgreementsReached },
//       { question: 'Please bullet point any agreements reached ', answer: data.discussions[1]?.['Discussion Two']?.firstAgendaAgreedBulletsPoints},
//       { question: 'Action points for the clients', answer: data.discussions[1]?.['Discussion Two']?.firstAgendaClientsActionPoints },
//       { question: 'Is there a third agenda point?', answer: data.discussions[1]?.['Discussion Two']?.secondAgendaCheck },

//       // { question: 'First agenda point discussed.', answer: data.discussions[0]?.['Discussion One']?.firstAgendaPointDiscussed },
//       // { question: 'Issues identified', answer: data.discussions[0]?.['Discussion One']?.firstAgendaIssuesIdentified },
//       // { question: 'Options discussed', answer: data.discussions[0]?.['Discussion One']?.firstAgendaOptionsDiscussed},
//       // { question: 'Any agreements reached?', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAnyAgreementsReached },
//       // { question: 'Please bullet point any agreements reached ', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAgreedBulletsPoints},
//       // { question: 'Action points for the clients', answer: mediationRecord.discussions[0]?.['Discussion One']?.firstAgendaClientsActionPoints },
//       // { question: 'Is there a second agenda point?', answer: mediationRecord.discussions[0]?.['Discussion One']?.secondAgendaCheck },
    
//       // { question: 'First agenda point discussed.', answer: data.discussions[0]?.['Discussion One']?.firstAgendaPointDiscussed },
//       // { question: 'Issues identified', answer: data.discussions[0]?.['Discussion One']?.firstAgendaIssuesIdentified },
//       // { question: 'Options discussed', answer: data.discussions[0]?.['Discussion One']?.firstAgendaOptionsDiscussed},
//       // { question: 'Any agreements reached?', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAnyAgreementsReached },
//       // { question: 'Please bullet point any agreements reached ', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAgreedBulletsPoints},
//       // { question: 'Action points for the clients', answer: mediationRecord.discussions[0]?.['Discussion One']?.firstAgendaClientsActionPoints },
//       // { question: 'Is there a second agenda point?', answer: mediationRecord.discussions[0]?.['Discussion One']?.secondAgendaCheck },
    
    
//       // { question: 'First agenda point discussed.', answer: data.discussions[0]?.['Discussion One']?.firstAgendaPointDiscussed },
//       // { question: 'Issues identified', answer: data.discussions[0]?.['Discussion One']?.firstAgendaIssuesIdentified },
//       // { question: 'Options discussed', answer: data.discussions[0]?.['Discussion One']?.firstAgendaOptionsDiscussed},
//       // { question: 'Any agreements reached?', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAnyAgreementsReached },
//       // { question: 'Please bullet point any agreements reached ', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAgreedBulletsPoints},
//       // { question: 'Action points for the clients', answer: mediationRecord.discussions[0]?.['Discussion One']?.firstAgendaClientsActionPoints },
//       // { question: 'Is there a second agenda point?', answer: mediationRecord.discussions[0]?.['Discussion One']?.secondAgendaCheck },
    
//       // { question: 'First agenda point discussed.', answer: data.discussions[0]?.['Discussion One']?.firstAgendaPointDiscussed },
//       // { question: 'Issues identified', answer: data.discussions[0]?.['Discussion One']?.firstAgendaIssuesIdentified },
//       // { question: 'Options discussed', answer: data.discussions[0]?.['Discussion One']?.firstAgendaOptionsDiscussed},
//       // { question: 'Any agreements reached?', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAnyAgreementsReached },
//       // { question: 'Please bullet point any agreements reached ', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAgreedBulletsPoints},
//       // { question: 'Action points for the clients', answer: mediationRecord.discussions[0]?.['Discussion One']?.firstAgendaClientsActionPoints },
//       // { question: 'Is there a second agenda point?', answer: mediationRecord.discussions[0]?.['Discussion One']?.secondAgendaCheck },

//       // { question: 'First agenda point discussed.', answer: data.discussions[0]?.['Discussion One']?.firstAgendaPointDiscussed },
//       // { question: 'Issues identified', answer: data.discussions[0]?.['Discussion One']?.firstAgendaIssuesIdentified },
//       // { question: 'Options discussed', answer: data.discussions[0]?.['Discussion One']?.firstAgendaOptionsDiscussed},
//       // { question: 'Any agreements reached?', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAnyAgreementsReached },
//       // { question: 'Please bullet point any agreements reached ', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAgreedBulletsPoints},
//       // { question: 'Action points for the clients', answer: data.discussions[0]?.['Discussion One']?.firstAgendaClientsActionPoints },
//       // { question: 'Is there a second agenda point?', answer: data.discussions[0]?.['Discussion One']?.secondAgendaCheck },

//       // { question: 'First agenda point discussed.', answer: data.discussions[0]?.['Discussion One']?.firstAgendaPointDiscussed },
//       // { question: 'Issues identified', answer: data.discussions[0]?.['Discussion One']?.firstAgendaIssuesIdentified },
//       // { question: 'Options discussed', answer: data.discussions[0]?.['Discussion One']?.firstAgendaOptionsDiscussed},
//       // { question: 'Any agreements reached?', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAnyAgreementsReached },
//       // { question: 'Please bullet point any agreements reached ', answer: data.discussions[0]?.['Discussion One']?.firstAgendaAgreedBulletsPoints},
//       // { question: 'Action points for the clients', answer: data.discussions[0]?.['Discussion One']?.firstAgendaClientsActionPoints },
//       // { question: 'Is there a second agenda point?', answer: data.discussions[0]?.['Discussion One']?.secondAgendaCheck },


    
//     ];
    
        
//         const startX = 50;
//         let currentY = pageHeight - 50;
//         const questionWidth = 500; // Adjust the width as needed
  
  
//     //     for (const { question, answer } of questionsAndAnswers) {
  
        
  
//     //       const validQuestion = question || ''; 
//     //       const validAnswer = answer  ||  ''; 
        
//     //       currentY = drawTextBlock(pages[pageNumber], validQuestion, startX, currentY, BoldFont, questionWidth, 25);
        
  
//     //     // Additional space between Question and Answer
//     //       const gapBetweenQA = 15;
//     //       currentY -= gapBetweenQA;
  
//     //     if (answer) {
//     //       currentY = drawTextBlock(pages[pageNumber], validAnswer , startX, currentY, font, questionWidth, 25);
//     //     }
  
//     //     // Additional space between this Q&A and the next
//     //     const gapBetweenBlocks = 20;
//     //     currentY -= gapBetweenBlocks;
  
     
  
//     //   // Move to the next page if necessary
//     //   if (currentY <= 100) {
  
//     //     // Add a new page and reset currentY
//     //     pageNumber += 1;
//     //     currentY = pageHeight - 50;
//     //     pages[pageNumber] = pdfDoc.addPage();
  
//     //     currentY -= 20;
//     //   }
//     // }
    
//     for (const { question, answer } of questionsAndAnswers) {
//       const validQuestion = question || '';
//       const validAnswer = answer || '';
    
//       // Check if the answer is not an empty string before drawing
//       if (validAnswer.trim() !== '') {
//         currentY = drawTextBlock(pages[pageNumber], validQuestion, startX, currentY, BoldFont, questionWidth, 25);
    
//         // Additional space between Question and Answer
//         const gapBetweenQA = 15;
//         currentY -= gapBetweenQA;
    
//         currentY = drawTextBlock(pages[pageNumber], validAnswer, startX, currentY, font, questionWidth, 25);

//               // Additional space between this Q&A and the next
//         const gapBetweenBlocks = 25;
//         currentY -= gapBetweenBlocks;
//       }
  
    
//       // Move to the next page if necessary
//       if (currentY <= 100) {
//         // Add a new page and reset currentY
//         pageNumber += 1;
//         currentY = pageHeight - 50;
//         pages[pageNumber] = pdfDoc.addPage();
    
//         currentY -= 20;
//       }
//     }
    


//     const pdfBytes = await pdfDoc.save();
//     return pdfBytes;
// }



function getLinesNumber(text) {
  // Check if 'text' is defined and not null before accessing its 'length' property
  if (text && typeof text === 'string') {
    return text.length / 35;
  } else {
    // Handle the case where 'text' is undefined or not a string
    return 0; // Or some default value or error handling logic
  }
}

const drawTextBlock = (page, text, startX, startY, font, maxWidth, lineHeight) => {
  if (typeof text === 'undefined' || text === null) {
    return startY; // If text is not provided, don't draw and return the original Y-coordinate.
  }
  page.drawText(text, {
    x: startX,
    y: startY,
    font,
    maxWidth,
    lineHeight,
  });
  const numberOfLines = getLinesNumber(text);
  return startY - (lineHeight * numberOfLines);
};







router.post("/sendRecordFormToMediator/:id", authMiddleware, async (req, res) => {
  try {
    if (req.userRole == "company") {
      let CaseFoundID
      let comp = await Company.findById(req.user._id);

      for (let i = 0; i < comp.cases.length; i++) {


        if (comp.cases[i] == req.params.id) {

          CaseFoundID = (comp.cases[i])

        }
      }

      if (CaseFoundID) {

        let mediatorData = {}, caseData = {}

        const currentMediator = await Case.findById(req.params.id).populate('connectionData.mediatorID');
        mediatorData.email = currentMediator.connectionData.mediatorID.email;
        mediatorData.name = `${currentMediator.connectionData.mediatorID.firstName} ${currentMediator.connectionData.mediatorID.lastName} `;
        const currentCase = await Case.findById(req.params.id)
        caseData.caseReference = currentCase.Reference
        caseData.caseID = req.params.id

        MailRecordFormToMed(mediatorData, caseData)
        res.status(200).json({ "message": "Mediatio session record has been sent to the mediator " })
      } else {
        res.status(400).json("something wrong with accessing this case ... ")
      }
    }
    else {
      res.status(400).json("something wrong with auth ... ")
    }

  } catch (err) {
    res.status(400).json(err.message)
  }


});






module.exports = router