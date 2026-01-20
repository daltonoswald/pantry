const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

router.post('/', searchController.search);

module.exports = router;