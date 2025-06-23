// // utils/generateToken.js
// const jwt = require("jsonwebtoken");

// const generateToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// module.exports = generateToken;
// 📁 utils/generateToken.js
const dotenv = require("dotenv");
dotenv.config(); // Make sure this is at the top

const jwt = require("jsonwebtoken");

console.log("JWT_SECRET:", process.env.JWT_SECRET); 
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = generateToken;
