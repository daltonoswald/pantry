const express = require('express');
const recipeController = require('../controllers/recipeController');
const { optionalAuth } = require('../middleware/middleware');

const router = express.Router();

router.post('/new-recipe', recipeController.new_item);
router.post('/:recipeId', optionalAuth, recipeController.get_recipe);
router.post('/delete/:recipeId', recipeController.delete_recipe);
router.post('/favorite/:recipeId', recipeController.favorite_recipe);
router.delete('/unfavorite/:recipeId', recipeController.unfavorite_recipe);
router.get('/by-pantry', recipeController.get_recipes_by_pantry);
router.get('/makeable', recipeController.get_makeable_recipes);

module.exports = router;