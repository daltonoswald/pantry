const express = require('express');
const pantryController = require('../controllers/pantryController');

const router = express.Router();

router.post('/new-item', pantryController.new_item);

module.exports = router;