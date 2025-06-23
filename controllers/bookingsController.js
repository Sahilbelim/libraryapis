const User = require("../models/User");
const Book = require("../models/Book");

// 1. User requests a book
// exports.requestBook = async (req, res) => {
//   try {
//     const { bookId } = req.params;
//     const userId = req.body.userId;

//     const user = await User.findById(userId);
//     const book = await Book.findById(bookId);

//     if (!user || !book)
//       return res.status(404).json({ message: "User or Book not found" });

//     // Check if already requested
//     const alreadyBooked = user.bookedBooks.some(
//       (b) => b.bookId.toString() === bookId && b.status !== "returned"
//     );
//     if (alreadyBooked)
//       return res
//         .status(400)
//         .json({ message: "Book already requested or active." });

//     const today = new Date();
//     const dueDate = new Date(today);
//     dueDate.setDate(dueDate.getDate() + 14); // 2 weeks

//     user.bookedBooks.push({
//       bookId,
//       bookingDate: today,
//       dueDate,
//     });

//     await user.save();

//     res.status(200).json({ message: "Book requested successfully." });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// ✅ Request Book - with pass check
exports.requestBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.body.userId;

    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book) return res.status(404).json({ message: "User or Book not found" });

    // ✅ Check if user has valid library pass
    const today = new Date();
    if (!user.hasLibraryPass || !user.passExpiry || today > user.passExpiry) {
      return res.status(403).json({ message: "You need a valid library pass to request a book." });
    }

    const alreadyBooked = user.bookedBooks.some(
      (b) => b.bookId.toString() === bookId && b.status !== "returned"
    );
    if (alreadyBooked) return res.status(400).json({ message: "Book already requested or active." });

    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks

    user.bookedBooks.push({
      bookId,
      bookingDate: today,
      dueDate,
    });

    await user.save();

    res.status(200).json({ message: "Book requested successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // 2. Admin updates book status (approve/reject/issue)
// exports.updateBookingStatus = async (req, res) => {
//   try {
//     const { userId, bookId } = req.params;
//     const { status } = req.body; // "approved", "rejected", "issued"

//     const user = await User.findById(userId);
//     const book = await Book.findById(bookId);

//     if (!user || !book)
//       return res.status(404).json({ message: "User or Book not found" });

//     const booking = user.bookedBooks.find(
//       (b) => b.bookId.toString() === bookId && b.status !== "returned"
//     );

//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     booking.status = status;

//     if (status === "issued") {
//       if (book.availableCopies <= 0) {
//         return res
//           .status(400)
//           .json({ message: "No available copies to issue." });
//       }
//       book.availableCopies -= 1;
//     }

//     await user.save();
//     await book.save();

//     res.status(200).json({ message: `Book status updated to ${status}` });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
exports.updateBookingStatus = async (req, res) => {
  try {
    const { userId, bookId } = req.params;
    const { status } = req.body; // "approved", "rejected", "issued"

    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book) {
      return res.status(404).json({ message: "User or Book not found" });
    }

    const booking = user.bookedBooks.find(
      (b) => b.bookId.toString() === bookId // Removed status check
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only reduce available copies if we're issuing
    if (status === "issued") {
      if (book.availableCopies <= 0) {
        return res
          .status(400)
          .json({ message: "No available copies to issue." });
      }

      // Only decrease if not already issued to avoid double-decrement
      if (booking.status !== "issued") {
        book.availableCopies -= 1;
      }
    }

    booking.status = status;

    await user.save();
    await book.save();

    res.status(200).json({ message: `Book status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.updateBookingStatus = async (req, res) => {
//   try {
//     const { userId, bookId } = req.params;
//     const { status } = req.body; // "approved", "rejected", "issued"

//     const user = await User.findById(userId);
//     const book = await Book.findById(bookId);

//     if (!user || !book) {
//       return res.status(404).json({ message: "User or Book not found" });
//     }

//     // Debugging: log all bookedBooks with bookId and status
//     console.log(
//       "Booked Books:",
//       user.bookedBooks.map((b) => ({
//         bookId: b.bookId?.toString?.() || b.bookId,
//         status: b.status,
//       }))
//     );

//     // Safe comparison for both ObjectId and string
//     const bookingIndex = user.bookedBooks.findIndex(
//       (b) =>
//         (b.bookId?.toString?.() === bookId || b.bookId === bookId) &&
//         b.status !== "returned"
//     );

//     if (bookingIndex === -1) {
//       console.log("No booking matched bookId:", bookId);
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     const booking = user.bookedBooks[bookingIndex];
//     booking.status = status;

//     if (status === "issued") {
//       if (book.availableCopies <= 0) {
//         return res
//           .status(400)
//           .json({ message: "No available copies to issue." });
//       }
//       book.availableCopies -= 1;

//       // Optional: set issueDate and dueDate (e.g., due in 7 days)
//       booking.issueDate = new Date();
//       const dueDate = new Date();
//       dueDate.setDate(dueDate.getDate() + 7);
//       booking.dueDate = dueDate;
//     }

//     await user.save();
//     await book.save();

//     return res
//       .status(200)
//       .json({ message: `Book status updated to ${status}` });
//   } catch (err) {
//     console.error("Error in updateBookingStatus:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };

// 3. User returns a book
exports.returnBook = async (req, res) => {
  try {
    const { userId, bookId } = req.params;

    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book)
      return res.status(404).json({ message: "User or Book not found" });

    const booking = user.bookedBooks.find(
      (b) => b.bookId.toString() === bookId && b.status === "issued"
    );

    if (!booking)
      return res.status(404).json({ message: "Issued booking not found" });

    const today = new Date();
    booking.returnDate = today;
    booking.status = "returned";

    // Fine logic
    if (today > booking.dueDate) {
      const daysLate = Math.ceil(
        (today - booking.dueDate) / (1000 * 60 * 60 * 24)
      );
      booking.fine = daysLate * 10;
    }

    book.availableCopies += 1;
    await user.save();
    await book.save();

    res
      .status(200)
      .json({ message: "Book returned successfully.", fine: booking.fine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🆕 1. Create or Renew Library Pass
exports.createOrRenewPass = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);

    user.membershipPurchaseDate = today;
    user.passExpiry = nextYear;
    user.hasLibraryPass = true;

    await user.save();

    res.status(200).json({
      message: "Library pass created/renewed successfully.",
      validTill: user.passExpiry,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 

// 🛂 Create or Update Library Pass (1-year validity)
exports.createOrUpdatePass = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const today = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(today.getFullYear() + 1);

    user.hasLibraryPass = true;
    user.membershipPurchaseDate = today;
    user.passExpiry = oneYearFromNow;

    await user.save();

    res.status(200).json({
      message: "Library pass created or renewed successfully.",
      membershipPurchaseDate: user.membershipPurchaseDate,
      passExpiry: user.passExpiry,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};



// // Get all book requests for a specific user
// exports.getUserBookRequests = async (req, res) => {
//   try {
//     const { userId } = req.params; // Get userId from URL parameter

//     // Find the user by userId
//     const user = await User.findById(userId).populate("bookedBooks.bookId"); // Populate book details

//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Get all the requested books for the user
//     const bookedBooks = user.bookedBooks;

//     if (!bookedBooks || bookedBooks.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No book requests found for this user" });
//     }

//     // Prepare an array of book request details with populated book info
//     const bookRequests = bookedBooks.map((booking) => {
//       return {
//         bookId: booking.bookId._id,
//         bookTitle: booking.bookId.title,
//         bookAuthor: booking.bookId.author,
//         status: booking.status,
//         bookingDate: booking.bookingDate,
//         dueDate: booking.dueDate,
//         fine: booking.fine,
//         finePaid: booking.finePaid,
//       };
//     });

//     res.json({
//       count: bookRequests.length,
//       data: bookRequests,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.getUserBookRequests = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL parameter

    // Find the user by userId
    const user = await User.findById(userId).populate("bookedBooks.bookId"); // Populate book details

    if (!user) return res.status(404).json({ message: "User not found" });

    // Get all the requested books for the user
    const bookedBooks = user.bookedBooks;

    if (!bookedBooks || bookedBooks.length === 0) {
      return res
        .status(404)
        .json({ message: "No book requests found for this user" });
    }

    // Prepare an array of book request details with populated book info
    const bookRequests = bookedBooks.map((booking) => {
      return {
        bookId: booking.bookId._id,
        bookTitle: booking.bookId.title,
        bookAuthor: booking.bookId.author,
        bookCategory: booking.bookId.category, // Added category
        bookImage: booking.bookId.image, // Added image URL/path
        isAvailable: booking.bookId.availableCopies > 0, // Checking availability
        status: booking.status,
        bookingDate: booking.bookingDate,
        dueDate: booking.dueDate,
        fine: booking.fine,
        finePaid: booking.finePaid,
      };
    });

    res.json({
      count: bookRequests.length,
      data: bookRequests,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
