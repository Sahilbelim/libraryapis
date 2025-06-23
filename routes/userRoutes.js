// // 📁 routes/userRoutes.js
// const express = require("express");
// const router = express.Router();
// const userController = require("../controllers/userController");
// const { protect, isAdmin } = require("../middleware/authMiddleware");

// // Register/Login
// router.post("/register", userController.registerUser);
// router.post("/login", userController.loginUser);

// // Get user profile
// // router.get("/profile", protect, userController.getProfile);
// router.get("/profile", userController.getProfile);

// // Admin - search/filter users
// router.get("/all", userController.getAllUsers);
// // router.get("/all", protect, isAdmin, userController.getAllUsers);

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const userController = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");



// Register route with image upload
router.post("/register", userController.upload, userController.registerUser);


// Setup Multer for file uploads 
const storage = multer.diskStorage({ destination: function (req, file, cb) { cb(null, "uploads/"); }, filename: function (req, file, cb) { const ext = path.extname(file.originalname); cb(null, Date.now() + ext); }, }); const upload = multer({ storage });

// Register (with image upload) 
// router.post("/register", upload.single("idCardImage"), userController.registerUser);

// Login
 router.post("/login", userController.loginUser);

// Get profile (optionally use protect middleware)
 router.get("/profile/:userId", userController.getUserAndPassById); // or protect

// Admin - get all users (optionally use protect + isAdmin) 
router.get("/all", userController.getAllUsers); // or protect, isAdmin

module.exports = router;