const express = require('express');
const pantryController = require('../controllers/pantryController');

const router = express.Router();

router.post('/new-item', pantryController.new_item);
router.post('/delete-from-pantry', pantryController.delete_from_pantry)

module.exports = router;