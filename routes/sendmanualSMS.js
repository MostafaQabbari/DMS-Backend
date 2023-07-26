const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const decryptTwillioData = require('../middleware/getDataFromTwilio');


const sendSMS_manual = function (twillioInfo, clientNumber, messageBodyData) {

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
        next();
    }
    ).catch((err) => {

        console.log(err.message)
    });

}

router.post('/sendSMS', authMiddleware, decryptTwillioData, async (req, res, next) => {

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
       

        sendSMS_manual(twillioInfo, clientNumber, messageBodyData)

        res.status(200).json({ message: "SMS has been sent " })

    } catch (err) {
        res.status(400).json({ message: "error with the end point autherization" })
    }

});




module.exports = router;