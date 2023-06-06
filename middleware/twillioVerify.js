

// function to test if the twillio data is good  , will send message to confirm added

const verifyTwillio = async (req, res, next) => {
    
    
    const { twillioSID, twillioToken, twillioNumber }  = req.body.twillioData

    const x = require('twilio')(twillioSID, twillioToken);
    const phoneNumber = twillioNumber;

    //console.log("xxx" ,{ twillioSID, twillioToken, twillioNumber } )
    x.messages.create({
        body: `Your Client ${req.user.companyName} added his twillio `,
        from: phoneNumber,
        // to here will be the Drion to send him that the company added twillio number
        to: '+201553499532'
    }).then(message => {
      //  console.log({ message: "data added succesfully", messageID: message.sid });
        next();
    }
    ).catch((err) => {

        console.log({ errMessage: err.message });

    });
}

module.exports = verifyTwillio;

