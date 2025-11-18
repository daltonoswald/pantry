const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../middleware/middleware');

exports.new_item = [
    body('title', 'Title must not be empty')
        .trim()
        .isLength({ min: 1, max: 250 })
        .escape(),
    body('description', 'Description must not be empty')
        .trim()
        .isLength({ min: 1, max: 250 })
        .escape(),
    body('servings', 'servings must not be empty and must be higher than 0')
        .trim()
        .isLength({ min: 1, max: 250 })
        .escape(),
    body('cookTime', 'cook time must not be empty and must be higher than 0')
        .trim()
        .isLength({ min: 1, max: 250 })
        .escape(),
    // Checks to see if the ingredient list is an array with at least 1 ingredient
    body('ingredientList').isArray({ min: 1 }).withMessage('At least one ingredient is required'),
    // Goes through each object in the array and checks that it isn't empty (other than notes)
    body('ingredientList.*.ingredient').notEmpty().withMessage('Ingredient name is required'),
    body('ingredientList.*.ingredientNote'),
    body('ingredientList.*.unit').notEmpty().withMessage('Ingredient unit is required'),
    body('ingredientList.*.unitAmount').notEmpty().withMessage('Ingredient unit amount is required'),
    body('directions', 'directions must not be empty')
        .trim()
        .isLength({ min: 1, max: 5000 })
        .escape(),
    body('tags', 'tags must not be empty')
        .trim()
        .isLength({ min: 1, max: 250 })
        .escape(),
    
    async (req, res, next) => {
        const errors = validationResult(req);
        const token = req.headers.authorization.split(' ')[1];
        const authorizedUser = verifyToken(token);
        const tokenUserId = authorizedUser.user.id;

        console.log(req.body);
        console.log(req.body.ingredientList[0].ingredient)
    }
]