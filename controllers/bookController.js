// // 📁 controllers/bookController.js
// const Book = require("../models/Book");

// exports.getAllBooks = async (req, res) => {
//   try {
//     const filters = req.query;
//     const books = await Book.find(filters);
//     res.json(books);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.getBookById = async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id);
//     if (!book) return res.status(404).json({ message: "Book not found" });
//     res.json(book);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.likeBook = async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id);
//     if (!book.likedBy.includes(req.user._id)) {
//       book.likedBy.push(req.user._id);
//     }
//     await book.save();
//     res.json({ message: "Book liked" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


const Book = require("../models/Book");

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const filters = req.query;
    const books = await Book.find(filters);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new book
// exports.addBook = async (req, res) => {
//   console.log("Request body:", req.body);
//   try {
//     console.log("Uploaded file:", req.file);
//     const { title, author, category, description, totalCopies } = req.body;
//     const imagePath = req.file ? `/books/${req.file.filename}` : "";
//     const totalCopiesNum = Number(totalCopies);
//     const newBook = new Book({
//       title,
//       author,
//       category,
//       description,
//       image: imagePath,
//       totalCopies,
//       availableCopies: totalCopies,
//     });

//     const savedBook = await newBook.save();
//     res.status(201).json(savedBook);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
// const Book = require("../models/book"); // update with your actual path

exports.addBook = async (req, res) => {
  try {
    const { title, author, category, description, totalCopies } = req.body;
    let imageUrl = "";

    // ✅ Upload to Cloudinary (folder: upload/book)
    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "upload/book", // ✅ Save under folder in Cloudinary
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req);
      imageUrl = result.secure_url;
    }

    const book = new Book({
      title,
      author,
      category,
      description,
      image: imageUrl,
      totalCopies: Number(totalCopies),
      availableCopies: Number(totalCopies),
    });

    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (err) {
    console.error("Error uploading book:", err.message, err);
    res.status(500).json({ message: err.message });
  }
};



// Update/edit an existing book


exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const { title, author, category, description, totalCopies } = req.body;

    // ✅ If new image uploaded, delete old and upload new
    if (req.file) {
      // Delete old image from Cloudinary (if exists)
      if (book.image) {
        const publicId = getCloudinaryPublicId(book.image);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Upload new image
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "upload/book" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req);
      book.image = result.secure_url;
    }

    // ✅ Update other fields
    book.title = title;
    book.author = author;
    book.category = category;
    book.description = description;
    book.totalCopies = Number(totalCopies);
    book.availableCopies = Number(totalCopies); // Optional logic

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    console.error("Error updating book:", err.message);
    res.status(500).json({ message: err.message });
  }
};


// exports.updateBook = async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id);
//     if (!book) return res.status(404).json({ message: "Book not found" });

//     Object.assign(book, req.body); // Simple update
//     const updatedBook = await book.save();

//     res.json(updatedBook);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // ✅ Delete image from Cloudinary if exists
    if (book.image) {
      const publicId = getCloudinaryPublicId(book.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    res.json({ message: "Book deleted" });
  } catch (err) {
    console.error("Error deleting book:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// exports.deleteBook = async (req, res) => {
//   try {
//     const book = await Book.findByIdAndDelete(req.params.id);
//     if (!book) return res.status(404).json({ message: "Book not found" });

//     res.json({ message: "Book deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Like a book
exports.likeBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const userId = req.user._id;

    if (!book.likedBy.includes(userId)) {
      book.likedBy.push(userId);
      await book.save();
    }

    res.json({ message: "Book liked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// exports.filterBooks = async (req, res) => {
//   try {
//     const { title, category, author, description } = req.body;

   
//     // Build dynamic filter object
//     const filter = {};

//     if (title) {
//       filter.title = { $regex: title, $options: "i" }; // case-insensitive
//     }

//     if (category) {
//       filter.category = { $regex: category, $options: "i" };
//     }

//     if (author) {
//       filter.author = { $regex: author, $options: "i" };
//     }

//     if (description) {
//       filter.description = { $regex: description, $options: "i" };
//     }

//     const books = await Book.find(filter);
//     res.json(books);
//   } catch (err) {
//     console.error("Error filtering books:", err);
//     res.status(500).json({ message: "Server error while filtering books." });
//   }
// };

exports.filterBooks = async (req, res) => {
  try {
    const { title, author, category, description } = req.body;

    const conditions = [];

    if (title) {
      conditions.push({ title: { $regex: title, $options: "i" } });
    }
    if (author) {
      conditions.push({ author: { $regex: author, $options: "i" } });
    }
    if (category) {
      conditions.push({ category: { $regex: category, $options: "i" } });
    }
    if (description) {
      conditions.push({ description: { $regex: description, $options: "i" } });
    }

    let books;
    if (conditions.length > 0) {
      books = await Book.find({ $or: conditions });
    } else {
      books = await Book.find(); // Return all books if no filters
    }

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

function getCloudinaryPublicId(imageUrl) {
  try {
    const parts = imageUrl.split("/");
    const folderIndex = parts.findIndex((p) => p === "upload");
    const publicPathParts = parts.slice(folderIndex + 1); // e.g., ["book", "filename.jpg"]
    const publicPath = publicPathParts.join("/").split(".")[0]; // remove extension
    return publicPath; // e.g., "book/filename"
  } catch {
    return null;
  }
}
