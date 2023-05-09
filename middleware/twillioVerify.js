



const verifyTwillio = async (req, res, next) => {
   




    const { twillioSID, twillioToken, twillioNumber } = req.body;


    const x = require('twilio')(twillioSID, twillioToken);

    const phoneNumber = twillioNumber;
    x.messages.create({
        body: `Your Client ${req.user.companyName} added his twillio `,
        from: phoneNumber,
        to: '+201553499532'
    }).then(message => {


      console.log({message : "data added succesfully" , messageID :message.sid});
        next();

    }
    ).catch((err) => {
        res.json({message : "something wrong please check your data"});
    });


   


}






module.exports = verifyTwillio;

