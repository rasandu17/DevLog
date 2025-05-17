const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getUserBlogs
} = require("../controllers/blogController");
const protect  = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBlog);

router.get("/", getAllBlogs);

// Get blogs by current user
router.get("/user", protect, getUserBlogs);

router.get("/:id", getBlogById);

router.put("/:id", protect, updateBlog);

router.delete("/:id", protect, deleteBlog);

module.exports = router;
