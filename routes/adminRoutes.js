const express = require("express");
const router = express.Router();
const { getAllBookRequests } = require("../controllers/adminController");

// Admin: View and filter all book requests
router.get("/book-requests", getAllBookRequests);

module.exports = router;
