const router = require('express').Router();
const blogController = require('../controllers/blog.controller');
const { protect } = require('../middleware/auth.middleware');

// Public
router.get('/', blogController.getPublishedBlogs);
router.get('/:id', blogController.getBlog);

// Protected
router.post('/', protect, blogController.createBlog);
router.get('/user/me', protect, blogController.getUserBlogs);
router.put('/:id', protect, blogController.updateBlog);
router.delete('/:id', protect, blogController.deleteBlog);

module.exports = router;
