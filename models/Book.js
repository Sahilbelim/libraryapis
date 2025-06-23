const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  description: String,
  image: String,
  totalCopies: Number,
  availableCopies: Number,
  isAvailable: { type: Boolean, default: true },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Book", BookSchema);
