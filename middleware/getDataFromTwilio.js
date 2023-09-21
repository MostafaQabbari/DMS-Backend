const CryptoJS = require("crypto-js");
const mediator = require('../models/mediator');
const Company = require("../models/company");

// at first we get data from twillio and decrypt it

const getDataFromTwillio = async function (user, role ,res) {

  if (role == 'company' && user.twillioData ) {
    // console.log(user.twillioData)
    const Data = CryptoJS.AES.decrypt(user.twillioData, 'ourTwillioEncyptionKey');
    const decryptedData = JSON.parse(Data.toString(CryptoJS.enc.Utf8))
   // console.log("decryptedData from middle are" ,decryptedData)
    return decryptedData[0]


  }
  else if (role == 'mediator') {
    const mediatorCompanyData = await mediator.findById(user._id).populate('companyId');
    if(mediatorCompanyData.companyId['twillioData'])
    {
      const Data = CryptoJS.AES.decrypt(mediatorCompanyData.companyId.twillioData, 'ourTwillioEncyptionKey');
      const decryptedData = JSON.parse(Data.toString(CryptoJS.enc.Utf8));
      return decryptedData[0]
    }
   else{
    console.log({"err" : "company does not twilio account yet"})
    res.status(400).json({"err" : "company does not twilio account yet"})
   }
  

  }
  else {
    console.log({ message: "something wrong with twilio data " })
    res.status(400).json({ "err": "something wrong with twilio data " })
  }
}


// this function take the decrypted data and solve the promise issue

function decryptTwillioData(req, res, next) {

  //console.log(req.user)
  let ReqDataTwillio = getDataFromTwillio(req.user, req.userRole ,res);

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

 
module.exports = decryptTwillioData