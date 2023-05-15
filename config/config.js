// const generateRefreshToken = (id, role) => {
//   return jwt.sign({ id, role }, config.refreshTokenSecret, { expiresIn: "7d" });
// };

module.exports = {
  jwtSecret: "mysecretkey",
  // refreshTokenSecret: "myrefreshsecretkey",
  // generateRefreshToken
};