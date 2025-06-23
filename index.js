// // 📁  app.js
// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const userRoutes = require("./routes/userRoutes");
// const bookRoutes = require("./routes/bookRoutes");
// const bookRequestRoutes = require("./routes/bookRequestRoutes");
// const libraryPassRoutes = require("./routes/libraryPassRoutes");
// const cors = require("cors");
// const multer = require("multer");
// // const errorHandler = require("./middleware/errorMiddleware");

// // app.use(errorHandler);

// const app = express();
// dotenv.config();
// connectDB();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/books", bookRoutes);
// app.use("/api/requests", bookRequestRoutes);
// app.use("/api/library-pass", libraryPassRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const bookRequestRoutes = require("./routes/bookRequestRoutes");
const libraryPassRoutes = require("./routes/libraryPassRoutes");
require("./cron/returnReminder");

// Load environment variables
dotenv.config();
const path = require("path");

// Serve uploaded images
// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/notifications", require("./routes/notificationRoutes"));


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log("Body:", req.body);
  next();
});

// Routes
const bookingRoutes = require("./routes/bookings");
app.use("/api/bookings", bookingRoutes);

app.use("/api/users", userRoutes);
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/requests", bookRequestRoutes);
app.use("/api/library-pass", libraryPassRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
