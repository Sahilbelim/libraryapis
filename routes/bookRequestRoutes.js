const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const bookRequestController = require("../controllers/bookRequestController");

// ✅ Use the actual function: bookRequestController.requestBook
router.post("/request", authenticateUser, bookRequestController.requestBook);

// Add other routes too as needed:
router.get(
  "/myrequests/:userId",
  //   authenticateUser,
  bookRequestController.getMyRequests
);
router.get("/all", authenticateUser, bookRequestController.getAllRequests);
router.put(
  "/approve/:id",
  authenticateUser,
  bookRequestController.approveRequest
);
router.put(
  "/reject/:id",
  authenticateUser,
  bookRequestController.rejectRequest
);
router.put("/return/:id", authenticateUser, bookRequestController.returnBook);
router.put("/fine/:id", authenticateUser, bookRequestController.payFine);

module.exports = router;
