const express = require('express');
const recipeController = require('../controllers/recipeController');
const { optionalAuth, requiredAuth } = require('../middleware/middleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.post('/new-recipe', requiredAuth, recipeController.new_item);
router.post('/upload-image', requiredAuth, upload.single('image'), recipeController.upload_image);
// router.post('/batch-check-favorites', requiredAuth, recipeController.batch_check_favorites);
router.get('/by-pantry', requiredAuth, recipeController.get_recipes_by_pantry);
router.get('/makeable', requiredAuth, recipeController.get_makeable_recipes);
router.get('/recent', optionalAuth, recipeController.get_recent_recipes);
router.get('/trending', optionalAuth, recipeController.get_trending_recipes);

router.post('/delete/:recipeId', requiredAuth, recipeController.delete_recipe);
// router.post('/favorite/:recipeId', requiredAuth, recipeController.favorite_recipe);
// router.delete('/unfavorite/:recipeId', requiredAuth, recipeController.unfavorite_recipe);
router.post('/toggle-favorite/:recipeId', requiredAuth, recipeController.toggle_favorite);

router.post('/:recipeId', optionalAuth, recipeController.get_recipe);

module.exports = router;