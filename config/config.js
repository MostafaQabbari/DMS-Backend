// const generateRefreshToken = (id, role) => {
//   return jwt.sign({ id, role }, config.refreshTokenSecret, { expiresIn: "7d" });
// };

module.exports = {
  jwtSecret: "mysecretkey",
  baseUrl:"https://dms5.onrender.com",
  companyEmail:"abdo.samir.7719@gmail.com",
  appPassWord:"bxhjghkbwnwumrzt"
  // refreshTokenSecret: "myrefreshsecretkey",
  // generateRefreshToken
};