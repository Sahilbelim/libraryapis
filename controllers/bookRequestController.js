// // 📁 controllers/bookRequestController.js
// const BookRequest = require("../models/BookRequest");
// const Book = require("../models/Book");
// const sendEmail = require("../utils/sendEmail");

// exports.requestBook = async (req, res) => {
//   try {
//     const { bookId } = req.body;
//     const book = await Book.findById(bookId);
//     if (!book || book.availableCopies <= 0)
//       return res.status(400).json({ message: "Book unavailable" });

//     const existing = await BookRequest.findOne({
//       user: req.user._id,
//       book: bookId,
//       status: "approved",
//     });
//     if (existing)
//       return res.status(400).json({ message: "You already have this book" });

//     const request = new BookRequest({ user: req.user._id, book: bookId });
//     await request.save();
//     res.json({ message: "Request submitted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.getMyRequests = async (req, res) => {
//   try {
//     // const requests = await BookRequest.find({ user: req.user._id }).populate(
//     //   "book"
//       // );
//       const requests = await BookRequest.find({
//         userId: req.user._id,
//       })
//         .populate("bookId")
//         .populate("userId");

//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // exports.getAllRequests = async (req, res) => {
// //   try {
// //     const requests = await BookRequest.find().populate("user").populate("book");
// //     res.json(requests);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };
// exports.getAllRequests = async (req, res) => {
//   try {
//     const requests = await BookRequest.find()
//       .populate("userId")
//       .populate("bookId");
//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.approveRequest = async (req, res) => {
//   try {
//     const request = await BookRequest.findById(req.params.id)
//       .populate("book")
//       .populate("user");
//     if (!request) return res.status(404).json({ message: "Request not found" });

//     request.status = "approved";
//     request.issueDate = new Date();
//     request.returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//     await request.save();

//     request.book.availableCopies -= 1;
//     await request.book.save();

//     await sendEmail(
//       request.user.email,
//       "Book Issued",
//       `<p>Your request for <strong>${request.book.title}</strong> is approved. Please collect it.</p>`
//     );

//     res.json({ message: "Approved" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.rejectRequest = async (req, res) => {
//   try {
//     const request = await BookRequest.findByIdAndUpdate(req.params.id, {
//       status: "rejected",
//     });
//     res.json({ message: "Rejected" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.returnBook = async (req, res) => {
//   try {
//     const request = await BookRequest.findById(req.params.id)
//       .populate("book")
//       .populate("user");
//     if (!request || request.status !== "approved")
//       return res.status(400).json({ message: "Invalid request" });

//     const today = new Date();
//     if (today > request.returnDate) {
//       const fine =
//         Math.ceil((today - request.returnDate) / (1000 * 60 * 60 * 24)) * 10;
//       request.fine = fine;
//       request.status = "returned-late";
//       await sendEmail(
//         request.user.email,
//         "Late Return Fine",
//         `<p>You returned <strong>${request.book.title}</strong> late. Fine: ₹${fine}</p>`
//       );
//     } else {
//       request.status = "returned";
//     }

//     request.book.availableCopies += 1;
//     await request.book.save();
//     await request.save();

//     res.json({ message: "Book returned" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.payFine = async (req, res) => {
//   try {
//     const request = await BookRequest.findById(req.params.id);
//     if (!request || !request.fine || request.finePaid)
//       return res.status(400).json({ message: "No fine to pay" });

//     request.finePaid = true;
//     await request.save();
//     res.json({ message: "Fine paid" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const BookRequest = require("../models/BookRequest");
const Book = require("../models/Book");
const sendEmail = require("../utils/sendEmail");

exports.requestBook = async (req, res) => {
  try {
    const { bookId } = req.body;

   
    const book = await Book.findById(bookId);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: "Book unavailable" });
    }

    const existing = await BookRequest.findOne({
      userId: req.user._id,
      bookId,
      status: "approved",
    });

    if (existing) {
      return res.status(400).json({ message: "You already have this book" });
    }

    const request = new BookRequest({
      userId: req.user._id,
      bookId,
    });

    await request.save();
    res.json({ message: "Request submitted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await BookRequest.find({ userId: req.params.userId })
      .populate("bookId", "title author category description image")
      .populate("userId", "name email");

  
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await BookRequest.find()
      .populate("userId", "name email")
      .populate("bookId", "title author");

 
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const request = await BookRequest.findById(req.params.id)
      .populate("bookId")
      .populate("userId");

   
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "approved";
    request.issueDate = new Date();
    request.returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +7 days
    await request.save();

    request.bookId.availableCopies -= 1;
    await request.bookId.save();

    await sendEmail(
      request.userId.email,
      "Book Issued",
      `<p>Your request for <strong>${request.bookId.title}</strong> is approved. Please collect it.</p>`
    );

    res.json({ message: "Approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await BookRequest.findByIdAndUpdate(req.params.id, {
      status: "rejected",
    });

   
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const request = await BookRequest.findById(req.params.id)
      .populate("bookId")
      .populate("userId");

    
    if (!request || request.status !== "approved") {
      return res.status(400).json({ message: "Invalid request" });
    }

    const today = new Date();

    if (today > request.returnDate) {
      const daysLate = Math.ceil(
        (today - request.returnDate) / (1000 * 60 * 60 * 24)
      );
      const fine = daysLate * 10;

      request.fine = fine;
      request.status = "returned-late";

      await sendEmail(
        request.userId.email,
        "Late Return Fine",
        `<p>You returned <strong>${request.bookId.title}</strong> late. Fine: ₹${fine}</p>`
      );
    } else {
      request.status = "returned";
    }

    request.bookId.availableCopies += 1;
    await request.bookId.save();
    await request.save();

    res.json({ message: "Book returned", fine: request.fine || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.payFine = async (req, res) => {
  try {
    const request = await BookRequest.findById(req.params.id);

     
    if (!request || !request.fine || request.finePaid) {
      return res.status(400).json({ message: "No fine to pay" });
    }

    request.finePaid = true;
    await request.save();

    res.json({ message: "Fine paid" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};