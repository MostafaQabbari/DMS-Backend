

// function to test if the twillio data is good  , will send message to confirm added

const verifyTwillio = async (req, res, next) => {
    
    
    const { twillioSID, twillioToken, twillioNumber }  = req.body.twillioData

    const x = require('twilio')(twillioSID, twillioToken);
    const phoneNumber = twillioNumber;

    //console.log("xxx" ,{ twillioSID, twillioToken, twillioNumber } )
    x.messages.create({
        body: `Twilio data has been added for  ${req.body.email}  `,
        from: phoneNumber,
        // to here will be the Drion to send him that the company added twillio number
        to: '+44 7476 544877'
    }).then(message => {
      //  console.log({ message: "data added succesfully", messageID: message.sid });
        next();
    }
    ).catch((err) => {

        console.log({ errMessage: err.message });
        res.status(400).json({message: err.message})

    });
}

module.exports = verifyTwillio;

