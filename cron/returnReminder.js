const cron = require("node-cron");
const BookRequest = require("../models/BookRequest");
const User = require("../models/User"); // assuming there's a user model
const sendNotification = require("../utils/sendNotification"); // custom function for sending email or in-app

cron.schedule("0 9 * * *", async () => {
  const today = new Date();
  const twoDaysFromNow = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);

  const dueRequests = await BookRequest.find({
    status: "approved",
    returnDate: {
      $gte: today,
      $lte: twoDaysFromNow,
    },
  }).populate("userId"); // assuming there's a userId ref in BookRequest

  dueRequests.forEach((request) => {
    sendNotification(
      request.userId.email,
      `Reminder: Book "${request.bookId}" is due soon.`
    );
  });
});
