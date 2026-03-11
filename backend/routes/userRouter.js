const express = require('express');
const userController = require('../controllers/userController');
const { optionalAuth } = require('../middleware/middleware');

const router = express.Router();

router.post('/log-in', userController.log_in);
router.post('/sign-up', userController.sign_up);
router.post('/profile/:username', optionalAuth, userController.profile);
router.post('/follow-user', userController.follow_user);
router.delete('/unfollow-user', userController.unfollow_user);
router.put('/edit-profile', userController.edit_profile);
router.get('/stats', userController.get_user_stats);

module.exports = router;