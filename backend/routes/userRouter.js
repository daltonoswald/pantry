const express = require('express');
const userController = require('../controllers/userController');
const { optionalAuth, requiredAuth } = require('../middleware/middleware');

const router = express.Router();

router.post('/log-in', userController.log_in);
router.post('/sign-up', userController.sign_up);
router.post('/profile/:username', optionalAuth, userController.profile);
router.post('/follow-user', requiredAuth, userController.follow_user);
router.delete('/unfollow-user', requiredAuth, userController.unfollow_user);
router.put('/edit-profile', requiredAuth, userController.edit_profile);
router.get('/stats', requiredAuth, userController.get_user_stats);

module.exports = router;