const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Case = require('../models/case');
const mediator = require('../models/mediator');
const Company = require("../models/company");
const CryptoJS = require("crypto-js");
const twillioMiddleware = require('../middleware/getDataFromPromise');




// :{twillioSID, twillioToken, twillioNumber}
const sendingSMS = function (twillioInfo, clientNumber, messageBodyData) {

 
  const x = require('twilio')(twillioInfo.twillioSID, twillioInfo.twillioToken);
  const phoneNumber = twillioInfo.twillioNumber;

  const messageBody = `Hello ${messageBodyData.clientName}  ,
   Here is your link to apply to the form ${messageBodyData.formLink} ,
   Best Regards ${messageBodyData.companyName} `
  x.messages.create({
    body: messageBody,
    from: phoneNumber,
    to: clientNumber
  }).then(message => {
    console.log({ message: "form message sent succesfully", messageID: message.sid });
    next();
  }
  )

}



router.post('/createCaseSMS', authMiddleware, twillioMiddleware, async (req, res, next) => {

  let twillioInfo;
  let clientNumber;
  let messageBodyData = {};
  twillioInfo = req.twillioInfo;
  try {
    const { firstName, surName, phoneNumber, dateOfMAIM, location } = req.body;

    if (req.userRole == 'company') {
      let newCase = await Case.insertMany(
        {
          client1ContactDetails: { firstName, surName, phoneNumber, dateOfMAIM, location },
          connectionData: { companyID: req.user._id }
        })
      clientNumber = phoneNumber;
      messageBodyData.clientName = `${newCase[0].client1ContactDetails.firstName} ${newCase[0].client1ContactDetails.surName}`;
      messageBodyData.formLink = `${"basicURL"}${req.url}/${newCase[0]._id}`;
      messageBodyData.companyName = req.user.companyName;
      sendingSMS(twillioInfo, clientNumber, messageBodyData)
      res.json({ message: " company has added client " })
    }
    else if (req.userRole == 'mediator') {
      const mediatorCompanyData = await mediator.findById(req.user._id).populate('companyId')
      let newCase = await Case.insertMany(
        {
          client1ContactDetails: { firstName, surName, phoneNumber, dateOfMAIM, location },
          connectionData: { mediatorID: req.user._id, companyID: mediatorCompanyData.companyId._id }
        });

      clientNumber = phoneNumber;
      messageBodyData.clientName = `${newCase[0].client1ContactDetails.firstName} ${newCase[0].client1ContactDetails.surName}`;
      messageBodyData.formLink = `${"basicURL"}${req.url}/${newCase[0]._id}`;
      messageBodyData.companyName = mediatorCompanyData.companyId.companyName
      sendingSMS(twillioInfo, clientNumber, messageBodyData)
      res.json({ message: " mediator has added client " })
    }

    else {
      res.json({ 'message': "error in the role of token" })
    }
  } catch (err) {
    res.json({ message: "error with the end point" })
  }

});

router.get('/test', async (req, res) => {

  const x = await mediator.find({ _id: '6454e93139652cb9b2f1de65' }).populate('companyId')
  console.log(x[0].companyId.companyName)

  res.json(x)
})

module.exports = router;
