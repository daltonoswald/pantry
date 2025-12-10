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
        const recipeData = req.body;

        try {
            const newRecipe = await prisma.recipe.create({
                data: {
                    title: recipeData.title,
                    description: recipeData.description,
                    userId: tokenUserId,
                    // parseInt to make it a number and not a string
                    servings: parseInt(recipeData.servings),
                    cookTime: parseInt(recipeData.cookTime),
                    directions: recipeData.directions,
                    ingredients: {
                        // Create or update all ingredients
                        create: await Promise.all(
                            recipeData.ingredientList.map(async (item) => {
                                // Find or create each ingredient in the master list
                                const ingredient = await prisma.ingredientMasterList.upsert({
                                    where: {
                                        name: item.ingredient.toLowerCase()
                                    },
                                    update: {},
                                    create: {
                                        name: item.ingredient.toLowerCase()
                                    }
                                });

                                return {
                                    ingredientId: ingredient.id,
                                    quantity: parseInt(item.unitAmount),
                                    measurement: item.unit,
                                    preparationNotes: item.ingredientNote || ''
                                };
                            })
                        )
                    },
                    tags: {
                        create: recipeData.tags.map(tag => ({ name: tag.toLowerCase() }))
                    }
                },
                include: {
                    ingredients: {
                        include: {
                            ingredient: true,
                        }
                    },
                    tags: true,
                }
            });

            res.json({ message: 'Recipe created successfully', recipe: newRecipe });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create recipe'})
        }
    }
]

exports.get_recipe = asyncHandler(async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const authorizedUser = verifyToken(token);
        const recipeToFind = req.body.recipeToFind;
        console.log(recipeToFind);
        const recipeData = await prisma.recipe.findFirst({
            where: {
                id: {
                    equals: recipeToFind,
                    mode: 'insensitive'
                }
            },
            include: {
                user: {
                    select: {
                        username: true,
                    }
                },
                ingredients: {
                    select: {
                        id: true,
                        quantity: true,
                        measurement: true,
                        preparationNotes: true,
                        ingredient: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        if (!recipeData) {
            res.status(404).json({error: 'Recipe not found.'})
        } else {
            console.log(recipeData);
            res.json({ recipeData: recipeData, user: authorizedUser });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({error: err})
    }
})