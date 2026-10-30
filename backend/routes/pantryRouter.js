const express = require('express');
const pantryController = require('../controllers/pantryController');
const { requiredAuth } = require('../middleware/middleware');

const router = express.Router();

router.post('/new-item', requiredAuth, pantryController.new_item);
router.post('/delete-from-pantry', requiredAuth, pantryController.delete_from_pantry)

module.exports = router;