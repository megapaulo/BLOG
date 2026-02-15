const Blog = require('../models/blog.model');
const calculateReadingTime = require('../readingTime/readingTime');

exports.createBlog = async (req, res) => {
  try {
    const reading_time = calculateReadingTime(req.body.body);
    const blog = await Blog.create({ ...req.body, author: req.user._id, reading_time });
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Fetch all published blogs (public)
exports.getPublishedBlogs = async (req, res) => {
  const { page = 1, limit = 20, author, title, tags, orderBy, sort = 'desc' } = req.query;

  const filter = { state: 'published' };
  if (author) filter.author = author;
  if (title) filter.title = new RegExp(title, 'i');
  if (tags) filter.tags = { $in: tags.split(',') };

  const orderOptions = ['read_count', 'reading_time', 'createdAt'];
  const sortOption = orderOptions.includes(orderBy) ? { [orderBy]: sort } : { createdAt: -1 };

  const blogs = await Blog.find(filter)
    .populate('author', 'first_name last_name email')
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ page, total: blogs.length, blogs });
};

// Get single blog (increments read_count)
exports.getBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'first_name last_name email');
  if (!blog || blog.state !== 'published') return res.status(404).json({ error: 'Blog not found' });

  blog.read_count += 1;
  await blog.save();
  res.json(blog);
};

// User-only routes
exports.getUserBlogs = async (req, res) => {
  const { state, page = 1, limit = 10 } = req.query;
  const filter = { author: req.user._id };
  if (state) filter.state = state;

  const blogs = await Blog.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.json(blogs);
};

exports.updateBlog = async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });
  if (!blog) return res.status(404).json({ error: 'Blog not found or unauthorized' });

  Object.assign(blog, req.body);
  blog.reading_time = calculateReadingTime(blog.body);
  await blog.save();
  res.json(blog);
};

exports.deleteBlog = async (req, res) => {
  const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user._id });
  if (!blog) return res.status(404).json({ error: 'Blog not found or unauthorized' });
  res.json({ message: 'Blog deleted successfully' });
};
