// // 📁 routes/bookRoutes.js
// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
// const bookController = require("../controllers/bookController");

// // View all books + filter
// router.get("/", bookController.getAllBooks);

// // View single book details
// router.get("/:id", bookController.getBookById);

// // Like a book
// router.put("/:id/like", protect, bookController.likeBook);

// module.exports = router;


const express = require("express");
const   router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const bookController = require("../controllers/bookController");
const qrController = require("../controllers/qrController");
// const { protect, isAdmin } = require("../middleware/authMiddleware");
// const multer = require("multer");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // buffer-based

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/books/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// const upload = multer({ storage });
// Public routes
router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.post("/", upload.single("image"), bookController.addBook);
router.put("/:id",upload.single("image"), bookController.updateBook);
router.delete("/:id", bookController.deleteBook);
router.put("/:id/like", bookController.likeBook);
router.post("/filter", bookController.filterBooks);
// Route to issue a book via QR code
router.post("/issue", qrController.issueBook);

// Route to return a book via QR code
router.post("/return", qrController.returnBook);
module.exports = router;

// Protected routes
// router.post("/", protect, bookController.addBook);
// router.put("/:id", protect, bookController.updateBook);
// router.delete("/:id", protect, bookController.deleteBook);
// router.put("/:id/like", protect, bookController.likeBook);
// Protected routes
// router.post("/", bookController.addBook);