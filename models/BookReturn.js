// const mongoose = require("mongoose");

// const BookReturnSchema = new mongoose.Schema({
//   requestId: { type: mongoose.Schema.Types.ObjectId, ref: "BookRequest" },
//   returnedOn: { type: Date, default: Date.now },
//   fine: { type: Number, default: 0 },
//   finePaid: { type: Boolean, default: false },
// });

// module.exports = mongoose.model("BookReturn", BookReturnSchema);

const mongoose = require("mongoose");

const BookRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  issueDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  actualReturnDate: { type: Date }, // new field
  status: {
    type: String,
    enum: ["pending", "approved", "returned", "returned-late"],
    default: "pending",
  },
  fine: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false },
});

module.exports = mongoose.model("BookRequest", BookRequestSchema);
