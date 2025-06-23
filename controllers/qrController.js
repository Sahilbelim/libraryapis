const Book = require("../models/Book");
const User = require("../models/User");
const BookRequest = require("../models/BookRequest");

// ✅ Issue Book Controller
exports.issueBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res
        .status(400)
        .json({ message: "userId and bookId are required" });
    }

    const book = await Book.findById(bookId);
    const user = await User.findById(userId);

    if (!book || !user) {
      return res.status(404).json({ message: "User or Book not found" });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }

    // 🔁 Check if already issued and not returned
    const existing = await BookRequest.findOne({
      userId,
      bookId,
      status: { $in: ["approved"] },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Book already issued to this user" });
    }

    // 📅 Set issue and return date
    const issueDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(issueDate.getDate() + 7); // 7-day issue period

    // ✅ Create new book request
    const newRequest = await BookRequest.create({
      userId,
      bookId,
      issueDate,
      returnDate,
      status: "approved",
    });

    // 🔄 Update available copies
    book.availableCopies -= 1;
    await book.save();

    res.json({ message: "Book issued successfully", request: newRequest });
  } catch (err) {
    console.error("Issue Book Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Return Book Controller
exports.returnBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res
        .status(400)
        .json({ message: "userId and bookId are required" });
    }

    // 🔎 Find approved request
    const request = await BookRequest.findOne({
      userId,
      bookId,
      status: "approved",
    });

    if (!request) {
      return res
        .status(404)
        .json({ message: "No active issue found for this user and book" });
    }

    const today = new Date();
    let fine = 0;

    // 🕒 Check for late return
    if (today > request.returnDate) {
      const daysLate = Math.ceil(
        (today - request.returnDate) / (1000 * 60 * 60 * 24)
      );
      fine = daysLate * 10; // ₹10 per day fine
      request.status = "returned-late";
    } else {
      request.status = "returned";
    }

    request.actualReturnDate = today;
    request.fine = fine;
    await request.save();

    // 🔄 Increase available copies
    await Book.findByIdAndUpdate(bookId, { $inc: { availableCopies: 1 } });

    res.json({ message: "Book returned successfully", fine });
  } catch (err) {
    console.error("Return Book Error:", err);
    res.status(500).json({ message: err.message });
  }
};
