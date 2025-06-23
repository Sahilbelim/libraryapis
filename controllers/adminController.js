// const User = require("../models/User");
// // const Book = require("../models/Book");

// // 🧾 Get all user book requests with optional filters
// exports.getAllBookRequests = async (req, res) => {
//   try {
//     const { status, startDate, endDate } = req.query;

//     const filter = {};

//     if (status) {
//       filter["bookedBooks.status"] = status;
//     }

//     // Date filter
//     if (startDate || endDate) {
//       filter["bookedBooks.bookingDate"] = {};
//       if (startDate)
//         filter["bookedBooks.bookingDate"].$gte = new Date(startDate);
//       if (endDate) filter["bookedBooks.bookingDate"].$lte = new Date(endDate);
//     }

//     // Flatten bookedBooks from all users
//     const users = await User.find({ "bookedBooks.0": { $exists: true } })
//       .select("name email bookedBooks")
//       .populate("bookedBooks.bookId", "title author");

//     const requests = [];

//     users.forEach((user) => {
//       user.bookedBooks.forEach((booking) => {
//         // Apply status filter
//         if (status && booking.status !== status) return;

//         // Apply date filter
//         if (startDate && new Date(booking.bookingDate) < new Date(startDate))
//           return;
//         if (endDate && new Date(booking.bookingDate) > new Date(endDate))
//           return;

//         requests.push({
//           userId: user._id,
//           userName: user.name,
//           userEmail: user.email,
//           bookTitle: booking.bookId?.title,
//           bookAuthor: booking.bookId?.author,
//           bookId: booking.bookId?._id,
//           status: booking.status,
//           bookingDate: booking.bookingDate,
//           dueDate: booking.dueDate,
//           returnDate: booking.returnDate,
//           fine: booking.fine,
//           finePaid: booking.finePaid,
//         });
//       });
//     });

//     // Sort by bookingDate (ascending)
//     requests.sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate));

//     res.status(200).json({ count: requests.length, data: requests });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const User = require("../models/User");

// 🧾 Get all user book requests with filters: status, bookingDate, dueDate, returnDate
exports.getAllBookRequests = async (req, res) => {
  try {
    const {
      status,
      startBookingDate,
      endBookingDate,
      startDueDate,
      endDueDate,
      startReturnDate,
      endReturnDate,
    } = req.query;

    const users = await User.find({ "bookedBooks.0": { $exists: true } })
      .select("name email bookedBooks")
      .populate("bookedBooks.bookId", "title author");

    const requests = [];

    users.forEach((user) => {
      user.bookedBooks.forEach((booking) => {
        // Filter by status
        if (status && booking.status !== status) return;

        // Filter by bookingDate
        if (
          startBookingDate &&
          new Date(booking.bookingDate) < new Date(startBookingDate)
        )
          return;
        if (
          endBookingDate &&
          new Date(booking.bookingDate) > new Date(endBookingDate)
        )
          return;

        // Filter by dueDate
        if (
          startDueDate &&
          (!booking.dueDate ||
            new Date(booking.dueDate) < new Date(startDueDate))
        )
          return;
        if (
          endDueDate &&
          (!booking.dueDate || new Date(booking.dueDate) > new Date(endDueDate))
        )
          return;

        // Filter by returnDate
        if (
          startReturnDate &&
          (!booking.returnDate ||
            new Date(booking.returnDate) < new Date(startReturnDate))
        )
          return;
        if (
          endReturnDate &&
          (!booking.returnDate ||
            new Date(booking.returnDate) > new Date(endReturnDate))
        )
          return;

        requests.push({
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          bookTitle: booking.bookId?.title,
          bookAuthor: booking.bookId?.author,
          bookId: booking.bookId?._id,
          status: booking.status,
          bookingDate: booking.bookingDate,
          dueDate: booking.dueDate,
          returnDate: booking.returnDate,
          fine: booking.fine,
          finePaid: booking.finePaid,
        });
      });
    });

    // Sort by bookingDate (ascending)
    requests.sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate));

    res.status(200).json({ count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
