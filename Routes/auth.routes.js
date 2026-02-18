const router = require('express').Router();
const authController = require('../controllers/auth.controller');
// const { signup, login } = require('../controllers/auth.controller');

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);


module.exports = router;
