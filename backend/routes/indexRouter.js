const express = require('express');
const indexController = require('../controllers/indexController');

const router = express.Router();

router.get('/', indexController.index);
router.post('/search', indexController.search)

module.exports = router;