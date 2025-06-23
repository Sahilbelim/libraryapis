// // 📁 routes/libraryPassRoutes.js
// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
// const passController = require("../controllers/libraryPassController");

// // View pass
// router.get("/my-pass", passController.getMyPass);

// // Buy new pass
// router.post("/buy", passController.buyLibraryPass);

// // Renew pass
// router.put("/renew", passController.renewLibraryPass);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const passController = require("../controllers/libraryPassController");

// USER routes
router.get("/my-pass", passController.getMyPass);
router.post("/buy", passController.buyLibraryPass);
router.put("/renew", passController.renewLibraryPass);

// ADMIN routes
router.get("/admin/:userId", passController.getUserPass);
router.post(
  "/admin/:userId/create",
  
 
  passController.createPassForUser
);
router.put(
  "/admin/:userId/update",

 
  passController.updateUserPass
);

module.exports = router;
