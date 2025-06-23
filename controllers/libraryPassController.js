// // 📁 controllers/libraryPassController.js
// const LibraryPass = require("../models/LibraryPass");

// exports.getMyPass = async (req, res) => {
//   const pass = await LibraryPass.findOne({ user: req.user._id });
//   res.json(pass);
// };

// // exports.buyLibraryPass = async (req, res) => {
// //   const existing = await LibraryPass.findOne({ user: req.user._id });
// //   if (existing) return res.status(400).json({ message: "Pass already exists" });
// //   const pass = new LibraryPass({ user: req.user._id });
// //   await pass.save();
// //   res.json({ message: "Pass created", pass });
// // };

// exports.buyLibraryPass = async (req, res) => {
//   try {
//     const existing = await LibraryPass.findOne({ userId: req.user._id });
//     if (existing)
//       return res.status(400).json({ message: "Pass already exists" });

//     const { purchaseDate, expiryDate, amountPaid } = req.body;

//     const pass = new LibraryPass({
//       userId: req.user._id,
//       purchaseDate: purchaseDate || new Date(),
//       expiryDate:
//         expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
//       amountPaid: amountPaid || 100,
//     });

//     await pass.save();
//     res.json({ message: "Pass created", pass });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// exports.renewLibraryPass = async (req, res) => {
//   const pass = await LibraryPass.findOne({ user: req.user._id });
//   if (!pass) return res.status(404).json({ message: "Pass not found" });
//   pass.expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
//   await pass.save();
//   res.json({ message: "Pass renewed" });
// };


const LibraryPass = require("../models/LibraryPass");
const User = require("../models/User");

// USER SIDE
exports.getMyPass = async (req, res) => {
  const pass = await LibraryPass.findOne({ userId: req.user._id });
  res.json(pass);
};

exports.buyLibraryPass = async (req, res) => {
  try {
    const existing = await LibraryPass.findOne({ userId: req.body.id });
    if (existing)
      return res.status(400).json({ message: "Pass already exists" });

    const { id,purchaseDate, expiryDate, amountPaid } = req.body;

    const pass = new LibraryPass({
      userId: id,
      purchaseDate: purchaseDate || new Date(),
      expiryDate:
        expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      amountPaid: amountPaid || 100,
    });

    await pass.save();
    res.json({ message: "Pass created", pass });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.renewLibraryPass = async (req, res) => {
  try {
    const pass = await LibraryPass.findOne({ userId: req.user._id });
    if (!pass) return res.status(404).json({ message: "Pass not found" });

    pass.expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    await pass.save();
    res.json({ message: "Pass renewed", pass });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN SIDE
exports.getUserPass = async (req, res) => {
  try {
    const pass = await LibraryPass.findOne({ userId: req.params.userId });
    if (!pass)
      return res.status(404).json({ message: "No pass found for user" });
    res.json(pass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPassForUser = async (req, res) => {
  try {
    const existing = await LibraryPass.findOne({ userId: req.params.userId });
    if (existing)
      return res.status(400).json({ message: "User already has a pass" });

    const { purchaseDate, expiryDate, amountPaid } = req.body;

    const pass = new LibraryPass({
      userId: req.params.userId,
      purchaseDate: purchaseDate || new Date(),
      expiryDate:
        expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      amountPaid: amountPaid || 100,
    });

    await pass.save();
    res.json({ message: "Pass created", pass });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserPass = async (req, res) => {
  try {
    const pass = await LibraryPass.findOne({ userId: req.params.userId });
    if (!pass)
      return res.status(404).json({ message: "No pass found for user" });

    const { expiryDate, amountPaid, status } = req.body;

    if (expiryDate) pass.expiryDate = new Date(expiryDate);
    if (amountPaid) pass.amountPaid = amountPaid;
    if (status) pass.status = status;

    await pass.save();
    res.json({ message: "Pass updated", pass });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
