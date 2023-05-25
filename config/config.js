// const generateRefreshToken = (id, role) => {
//   return jwt.sign({ id, role }, config.refreshTokenSecret, { expiresIn: "7d" });
// };

module.exports = {
  jwtSecret: "mysecretkey",
  baseUrl:"https://direct-mediation-services.vercel.app",
  companyEmail:"abdo.samir.7719@gmail.com",
  appPassWord:"evhxpzdevqnrrtpa",
  MIAM_PART_1_client1:"MIAM_PART_1_client1",
  MIAM_PART_2:"MIAM_PART_2"

 // appPassWord:"dffswebwucuxpayy" // app password for abdosamir2022.2022@gmail.com
  // refreshTokenSecret: "myrefreshsecretkey",
  // generateRefreshToken
};