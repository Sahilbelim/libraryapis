const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { authenticateUser } = require("../middleware/authMiddleware");

// GET /api/notifications - get all notifications for current user
router.get("/", authenticateUser, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
