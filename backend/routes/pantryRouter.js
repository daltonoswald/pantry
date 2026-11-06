const express = require('express');
const pantryController = require('../controllers/pantryController');
const { optionalAuth, requiredAuth } = require('../middleware/middleware');

const router = express.Router();

router.get('/by-user/:username', optionalAuth, pantryController.get_pantry_by_user);

router.post('/new-item', requiredAuth, pantryController.new_item);
router.post('/delete-from-pantry', requiredAuth, pantryController.delete_from_pantry);

module.exports = router;