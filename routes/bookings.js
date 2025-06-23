// const express = require("express");
// const router = express.Router();
// const {
//   requestBook,
//   updateBookingStatus,
//   returnBook,
// } = require("../controllers/bookingsController");

// // User requests a book
// router.post("/request/:bookId", requestBook);

// // Admin updates status (approve, reject, issue)
// router.patch("/update-status/:userId/:bookId", updateBookingStatus);

// // User returns the book
// router.post("/return/:userId/:bookId", returnBook);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  requestBook,
  updateBookingStatus,
  returnBook,
  createOrRenewPass,
  createOrUpdatePass,
  getUserBookRequests,
} = require("../controllers/bookingsController");

// Book related
router.post("/request/:bookId", requestBook);
router.patch("/update-status/:userId/:bookId", updateBookingStatus);
router.post("/return/:userId/:bookId", returnBook);
router.get("/user/:userId", getUserBookRequests);
// Pass related
router.post("/create-pass/:userId", createOrRenewPass);
router.post("/create-or-update/:userId", createOrUpdatePass);

module.exports = router;
