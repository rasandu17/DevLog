const Blog = require('../models/Blog')


// Create a new blog post
exports.createBlog = async (req, res) => {
  const { title, content } = req.body;

  try {
    const newBlog = new Blog({
      title,
      content,
      author: req.user.id
    });

    const blog = await newBlog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error creating blog post' });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name email');
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs' });
  }
};

// Get a single blog
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog' });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Check if the logged-in user is the author
    if (blog.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;

    await blog.save();
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error updating blog' });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Check if the logged-in user is the author
    if (blog.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await blog.remove();
    res.status(200).json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog' });
  }
};
