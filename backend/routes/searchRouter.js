const express = require('express');
const searchController = require('../controllers/searchController');
const { optionalAuth } = require('../middleware/middleware');

const router = express.Router();

router.post('/', optionalAuth, searchController.search);

module.exports = router;