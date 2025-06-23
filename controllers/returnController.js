// const BookRequest = require("../models/BookRequest");
// const Book = require("../models/Book");

// exports.processReturn = async (req, res) => {
//   try {
//     const request = await BookRequest.findById(req.params.id).populate(
//       "bookId"
//     );
//     if (!request || request.status !== "approved") {
//       return res.status(400).json({ message: "Invalid request" });
//     }

//     const today = new Date();
//     let fine = 0;

//     if (today > request.returnDate) {
//       const daysLate = Math.ceil(
//         (today - request.returnDate) / (1000 * 60 * 60 * 24)
//       );
//       fine = daysLate * 10;
//       request.status = "returned-late";
//       request.fine = fine;
//     } else {
//       request.status = "returned";
//     }

//     request.bookId.availableCopies += 1;
//     await request.bookId.save();
//     request.returnDate = today;
//     await request.save();

//     res.json({ message: "Book returned", fine });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.markFinePaid = async (req, res) => {
//   try {
//     const request = await BookRequest.findById(req.params.id);
//     if (!request || request.fine <= 0 || request.finePaid) {
//       return res
//         .status(400)
//         .json({ message: "No fine to pay or already paid" });
//     }

//     request.finePaid = true;
//     await request.save();

//     res.json({ message: "Fine marked as paid" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
const sendNotification = require("../utils/sendNotification");

const BookRequest = require("../models/BookRequest");
const Book = require("../models/Book");

// Process book return
// exports.processReturn = async (req, res) => {
//   try {
//     const request = await BookRequest.findById(req.params.id).populate(
//       "bookId"
//     );
//     if (!request || request.status !== "approved") {
//       return res.status(400).json({ message: "Invalid request" });
//     }

//     const today = new Date();
//     let fine = 0;

//     if (today > request.returnDate) {
//       const daysLate = Math.ceil(
//         (today - request.returnDate) / (1000 * 60 * 60 * 24)
//       );
//       fine = daysLate * 10;
//       request.status = "returned-late";
//     } else {
//       request.status = "returned";
//     }

//     request.fine = fine;
//     request.actualReturnDate = today;
//     request.bookId.availableCopies += 1;

//     await request.bookId.save();
//     await request.save();

//     res.json({ message: "Book returned", fine });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.processReturn = async (req, res) => {
  try {
    const request = await BookRequest.findById(req.params.id)
      .populate("bookId")
      .populate("userId"); // make sure to populate userId so we can notify the user

    if (!request || request.status !== "approved") {
      return res.status(400).json({ message: "Invalid request" });
    }

    const today = new Date();
    let fine = 0;
    let message = "";

    if (today > request.returnDate) {
      const daysLate = Math.ceil(
        (today - request.returnDate) / (1000 * 60 * 60 * 24)
      );
      fine = daysLate * 10;
      request.status = "returned-late";
      message = `Your book "${request.bookId.title}" was returned ${daysLate} day(s) late. A fine of ₹${fine} has been added.`;
    } else {
      request.status = "returned";
      message = `Thank you for returning the book "${request.bookId.title}" on time.`;
    }

    request.fine = fine;
    request.actualReturnDate = today;
    request.bookId.availableCopies += 1;

    await request.bookId.save();
    await request.save();

    // Send notification to user
    await sendNotification(request.userId._id, message);

    res.json({ message: "Book returned", fine });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark fine as paid
exports.markFinePaid = async (req, res) => {
  try {
    const request = await BookRequest.findById(req.params.id);
    if (!request || request.fine <= 0 || request.finePaid) {
      return res
        .status(400)
        .json({ message: "No fine to pay or already paid" });
    }

    request.finePaid = true;
    await request.save();

    res.json({ message: "Fine marked as paid" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user return/fine dashboard
exports.getUserReturns = async (req, res) => {
  try {
    const returns = await BookRequest.find({ userId: req.user._id }).populate(
      "bookId"
    );
    res.json(returns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: get all return data
exports.getAllReturns = async (req, res) => {
  try {
    const all = await BookRequest.find({
      status: { $in: ["returned", "returned-late"] },
    })
      .populate("userId")
      .populate("bookId");
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
