// // 📁 controllers/userController.js
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const generateToken = require("../utils/generateToken");

// exports.registerUser = async (req, res) => {
//   const { name, email, password } = req.body;
//   const exists = await User.findOne({ email });
//   if (exists) return res.status(400).json({ message: "User exists" });

//   const hashed = await bcrypt.hash(password, 10);
//   const user = new User({ name, email, password: hashed });
//   await user.save();

//   res.json({ token: generateToken(user._id) });
// };

// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }
//   res.json({ token: generateToken(user._id) });
// };

// exports.getProfile = async (req, res) => {
//   res.json(req.user);
// };

// exports.getAllUsers = async (req, res) => {
//   const query = req.query;
//   const users = await User.find(query);
//   res.json(users);
// };

const User = require("../models/User");
const bcrypt = require("bcryptjs"); const generateToken = require("../utils/generateToken");
const LibraryPass = require("../models/LibraryPass");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
// Register user with enrollment number and image
const multer = require("multer");
// const path = require("path");

// Storage engine
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Create this folder if not existing
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext); // unique filename
//   },
// });

const upload = multer({ storage: multer.memoryStorage() });
exports.upload = upload.single("idCardImage");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, role, password, enrollmentNumber } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    let imageUrl = null;

    // ✅ Upload ID card image to Cloudinary
    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "upload/idcard" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();
      imageUrl = result.secure_url;
    }

    const user = new User({
      name,
      email,
      role,
      password: hashed,
      enrollmentNumber,
      idCardImage: imageUrl,
    });

    await user.save();

    res.json({
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.registerUser = async (req, res) => {
//   const { name, email, role, password, enrollmentNumber } = req.body;

//   const exists = await User.findOne({ email });
//   if (exists) return res.status(400).json({ message: "User exists" });

//   const hashed = await bcrypt.hash(password, 10);

//   const user = new User({
//     name,
//     email,
//     role,
//     password: hashed,
//     enrollmentNumber,
//     idCardImage: req.file?.filename || null,
//   });

//   await user.save();
//   res.json({ token: generateToken(user._id), user: user });
// };

//  exports.registerUser = async (req, res) => { try { const { name, email, password, enrollmentNumber } = req.body;

 
// const exists = await User.findOne({ email });
// if (exists) return res.status(400).json({ message: "User already exists" });

// const hashed = await bcrypt.hash(password, 10);

// const user = new User({
//   name,
//   email,
//   password: hashed,
//   enrollmentNumber,
//   idCardImage: req.file?.path || "",
// });

// await user.save();
 
// res.json({ token: generateToken(user._id) });
// } catch (err) { res.status(500).json({ message: err.message }); } 
// };

exports.loginUser = async (req, res) => { try { const { email, password } = req.body;

 
const user = await User.findOne({ email });
if (!user || !(await bcrypt.compare(password, user.password))) {
  return res.status(401).json({ message: "Invalid credentials" });
}

res.json({ token: generateToken(user._id) ,user:user }); // Include user info in response
} catch (err) { res.status(500).json({ message: err.message }); } };



exports.getUserAndPassById = async (req, res) => {
  try {
    console.log("Request params:", req.params); // Debugging line
    const { userId } = req.params;

    // Find user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find library pass
    const pass = await LibraryPass.findOne({ userId });

    res.json({ user, pass }); // 'pass' may be null, which is okay
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllUsers = async (req, res) => { try { const query = req.query; const users = await User.find(query); res.json(users); } catch (err) { res.status(500).json({ message: err.message }); } };