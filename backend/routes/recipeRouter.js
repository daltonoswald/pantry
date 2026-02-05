const express = require('express');
const recipeController = require('../controllers/recipeController');
const { optionalAuth } = require('../middleware/middleware');

const router = express.Router();

router.post('/new-recipe', recipeController.new_item);
router.post('/:recipeId', optionalAuth, recipeController.get_recipe);
router.post('/delete/:recipeId', recipeController.delete_recipe);

module.exports = router;