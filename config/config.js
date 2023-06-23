// const generateRefreshToken = (id, role) => {
//   return jwt.sign({ id, role }, config.refreshTokenSecret, { expiresIn: "7d" });
// };

module.exports = {
  jwtSecret: "mysecretkey",
  baseUrlMIAM1:"https://direct-mediation-services.vercel.app",
  baseUrlMIAM2:'https://dms-2.vercel.app',
  baseUrlC2Invitation :'https://c2-reply-form.vercel.app/',

  companyEmail:"abdo.samir.7719@gmail.com",
  appPassWord:"evhxpzdevqnrrtpa",
  MIAM_PART_1_client1:"MIAM_PART_1_client1",
  MIAM_PART_2:"MIAM_PART_2",
  C2_Invitaion:"C2_Invitaion",
  C2_M1:"C2_M1"



 

 // appPassWord:"dffswebwucuxpayy" // app password for abdosamir2022.2022@gmail.com
  // refreshTokenSecret: "myrefreshsecretkey",
  // generateRefreshToken
};