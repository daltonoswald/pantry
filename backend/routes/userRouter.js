const express = require('express');
const userController = require('../controllers/userController');
const { optionalAuth } = require('../middleware/middleware');

const router = express.Router();

router.post('/log-in', userController.log_in);
router.post('/sign-up', userController.sign_up);
router.post('/profile/:username', optionalAuth, userController.profile);

module.exports = router;