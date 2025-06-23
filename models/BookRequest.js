const mongoose = require("mongoose");

const BookRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  requestDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "returned"],
    default: "pending",
  },
  dueDate: Date,
  returnDate: Date,
  fine: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false },
});

module.exports = mongoose.model("BookRequest", BookRequestSchema);
