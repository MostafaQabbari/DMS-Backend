const CryptoJS = require("crypto-js");
const mediator = require('../models/mediator');
const Company = require("../models/company");
const getTwillioData = async function (user, role) {

  if (role == 'company') {
    console.log(user.twillioData)
    const Data = CryptoJS.AES.decrypt(user.twillioData, 'ourTwillioEncyptionKey');
    const decryptedData = JSON.parse(Data.toString(CryptoJS.enc.Utf8))
    return decryptedData[0]


  }
  else if (role == 'mediator') {
    const mediatorCompanyData = await mediator.findById(user._id).populate('companyId');
    const Data = CryptoJS.AES.decrypt(mediatorCompanyData.companyId.twillioData, 'ourTwillioEncyptionKey');
    const decryptedData = JSON.parse(Data.toString(CryptoJS.enc.Utf8));
    return decryptedData[0]

  }
  else {
    res.json({ message: "couldn't get twilio data " })
  }
}



function twillioMiddleware(req, res, next) {
  let ReqDataTwillio = getTwillioData(req.user, req.userRole);

  const myPromise = new Promise((resolve, reject) => {
       resolve(ReqDataTwillio);
    });

    myPromise
    .then(data => {
      req.twillioInfo = data;
      next();
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
}


module.exports= twillioMiddleware