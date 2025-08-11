const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/log-in', userController.log_in);
router.post('/sign-up', userController.sign_up);

module.exports = router;