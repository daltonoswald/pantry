const express = require('express');
const tagController = require('../controllers/tagController');
const { optionalAuth } = require('../middleware/middleware');

const router = express.Router();

router.get('/popular', tagController.get_popular_tags)

module.exports = router;