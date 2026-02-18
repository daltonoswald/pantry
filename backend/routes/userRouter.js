const express = require('express');
const userController = require('../controllers/userController');
const { optionalAuth } = require('../middleware/middleware');

const router = express.Router();

router.post('/log-in', userController.log_in);
router.post('/sign-up', userController.sign_up);
router.post('/profile/:username', optionalAuth, userController.profile);
router.post('/follow-user', userController.follow_user);
router.post('/unfollow-user', userController.unfollow_user);

module.exports = router;