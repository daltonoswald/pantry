const express = require('express');
const recipeController = require('../controllers/recipeController');

const router = express.Router();

router.post('/new-recipe', recipeController.new_item);
router.post('/:recipeId', recipeController.get_recipe);
router.post('/delete/:recipeId', recipeController.delete_recipe);

module.exports = router;