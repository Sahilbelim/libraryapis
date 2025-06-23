const mongoose = require("mongoose");

const LibraryPassSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  purchaseDate: Date,
  expiryDate: Date,
  amountPaid: Number,
  status: { type: String, enum: ["active", "expired"], default: "active" },
});

module.exports = mongoose.model("LibraryPass", LibraryPassSchema);
