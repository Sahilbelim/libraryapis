const Notification = require("../models/Notification");

const sendNotification = async (userId, message) => {
  try {
    const notification = new Notification({ userId, message });
    await notification.save();
    console.log(`Notification sent to user ${userId}: ${message}`);
  } catch (err) {
    console.error("Notification error:", err.message);
  }
};

module.exports = sendNotification;
