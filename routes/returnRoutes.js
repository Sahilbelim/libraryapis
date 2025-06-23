// const express = require("express");
// const router = express.Router();
// const { protect, isAdmin } = require("../middleware/authMiddleware");
// const returnController = require("../controllers/returnController");

// // Return a book
// router.put("/:id/return", protect, returnController.processReturn);

// // Pay fine
// router.put("/:id/pay-fine", protect, returnController.markFinePaid);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const returnController = require("../controllers/returnController");

// User routes
router.put("/:id/return", protect, returnController.processReturn);
router.put("/:id/pay-fine", protect, returnController.markFinePaid);
router.get("/my-returns", protect, returnController.getUserReturns);

// Admin routes
router.get("/admin/returns", protect, isAdmin, returnController.getAllReturns);

module.exports = router;
