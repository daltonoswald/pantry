const express = require('express');
const recipeController = require('../controllers/recipeController');

const router = express.Router();

router.post('/new-recipe', recipeController.new_item);

module.exports = router;