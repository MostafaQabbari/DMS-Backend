

const verifyTwillio = async (req, res, next) => {



    const { twillioSID, twillioToken, twillioNumber } = req.body;

    const x = require('twilio')(twillioSID, twillioToken);

    const phoneNumber = twillioNumber;
    x.messages.create({
        body: 'test tanni ya 3ammm ',
        from: phoneNumber,
        to: '+201553499532'
    }).then(message => {
     
        res.json({message : "data added succesfully"} , {messageID :message.sid});
        next();

    }
    ).catch((err) => {
        res.json({message : "something wrong please check your data"});
    });





}






module.exports = verifyTwillio;

