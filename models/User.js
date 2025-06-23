// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,

//   // Role Management
//   role: { type: String, enum: ["user", "admin", "librarian"], default: "user" },

//   // Library Pass
//   hasLibraryPass: { type: Boolean, default: false },
//   membershipPurchaseDate: Date,
//   passExpiry: Date,

//   // Booked Books
//   bookedBooks: [
//     {
//       bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
//       status: {
//         type: String,
//         enum: ["requested", "approved", "rejected", "returned"],
//         default: "requested",
//       },
//       bookingDate: Date,
//       dueDate: Date,
//       returnDate: Date,
//       fine: { type: Number, default: 0 },
//       finePaid: { type: Boolean, default: false },
//     },
//   ],
// });

// module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  // Additional Fields
  enrollmentNumber: { type: String, unique: true }, // Student Enrollment
  idCardImage: { type: String }, // URL or path to image

  // Role Management
  role: { type: String, enum: ["user", "admin", "librarian"], default: "user" },

  // Library Pass
  hasLibraryPass: { type: Boolean, default: false },
  membershipPurchaseDate: Date,
  passExpiry: Date,

  // Booked Books
  bookedBooks: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      status: {
        type: String,
        enum: ["requested", "approved","issued", "rejected", "returned"],
        default: "requested",
      },
      bookingDate: Date,
      dueDate: Date,
      returnDate: Date,
      fine: { type: Number, default: 0 },
      finePaid: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
