const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../middleware/middleware');
const { cloudinary } = require('../config/cloudinary');

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
    body('steps.*').notEmpty().withMessage('Steps must not be empty'),
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
                    image: recipeData.imageUrl || null,
                    // parseInt to make it a number and not a string
                    servings: parseInt(recipeData.servings),
                    cookTime: parseInt(recipeData.cookTime),
                    steps: {
                        // Create each Step
                        create: recipeData.steps.map((step, index) => ({
                            step: step,
                            order: index + 1
                        }))
                    },
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
                                    // quantity: parseInt(item.unitAmount),
                                    quantity: parseFloat(item.unitAmount),
                                    measurement: item.unit,
                                    preparationNotes: item.ingredientNote || ''
                                };
                            })
                        )
                    },
                    recipeTags: {
                        create: await Promise.all(
                            recipeData.tags.map(async (tagName) => {
                                const tag = await prisma.tagMasterList.upsert({
                                    where: { name: tagName.toLowerCase() },
                                    update: {},
                                    create: { name: tagName.toLowerCase() }
                                });

                                return {
                                    tagId: tag.id
                                }
                            })
                        )
                    }
                },
                include: {
                    steps: {
                        orderBy: {
                            order: 'asc'
                        }
                    },
                    ingredients: {
                        include: {
                            ingredient: true,
                        }
                    },
                    recipeTags: {
                        include: {
                            tag: true
                        }
                    }
                }
            });

            res.json({ message: 'Recipe created successfully.', recipe: newRecipe });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create recipe.'})
        }
    }
]

exports.upload_image = asyncHandler(async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        // Upload buffer directly to cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'pantry',
                    public_id: `recipe-${Date.now()}`,
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary stream error full object:', JSON.stringify(error, null, 2));
                        reject(error)
                    } else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        })

        // Optionally attach to a recipe immediately
        const { recipeId } = req.body;

        if (recipeId) {
            const recipe = await prisma.recipe.findUnique({
                where: { id: recipeId },
                select: { userId: true, image: true }
            });

            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found.' });
            }

            if (recipe.userId !== authorizedUser.user.id) {
                return res.status(403).json({ error: 'Unauthorized.' });
            }

            // Delete old image from cloudinary if it exists
            if (recipe.image) {
                const publicId = recipe.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`pantry/recipes/${publicId}`);
            }

            const updated = await prisma.recipe.update({
                where: { id: recipeId },
                data: { image: req.file.path }
            });

            return res.json({ 
                message: 'Image uploaded successfully.',
                imageUrl: req.file.path,
                recipe: updated 
            });
        }

        console.log('req.file.path', req.file.path)
        // Or just return the URL to use later on recipe creation
        res.json({
            message: 'Image uploaded succesfully.',
            imageUrl: req.file.path
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image.' })
    }
})

exports.get_recipe = asyncHandler(async (req, res, next) => {
    try {
        // const token = req.headers.authorization.split(' ')[1];
        // const authorizedUser = verifyToken(token);
        const currentUser = req.user; // Set by optionalAuth middleware
        const recipeToFind = req.body.recipeToFind;
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
                steps: {
                    orderBy: {
                        order: 'asc'
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
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                recipeTags: {
                    select: {
                        id: true,
                        tag: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                comments: {
                    include: {
                        user: { 
                            select: {
                                id: true,
                                username: true,
                                name: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                _count: {
                    select: {
                        favorites: true,
                        comments: true
                    }
                },
                favorites: currentUser ? {
                    where: {
                        userId: currentUser.id
                    }
                } : false
            }
        })
        if (!recipeData) {
            return res.status(404).json({ error: 'Recipe not found.' })
        } else {
            // res.json({ recipeData: recipeData, user: authorizedUser });
            res.json({
                recipeData,
                ...(currentUser && {
                    currentUser: {
                        id: currentUser.id,
                        username: currentUser.username
                    },
                    isAuthor: recipeData.userId === currentUser.id,
                    isFavorited: recipeData.favorites?.length > 0
                })
            })
        }
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ error: 'An error occured while fetching the recipe.' });
    }
})

exports.delete_recipe = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const recipeId = req.body.recipeToDelete

    try {
        // verify that the recipe exists
        const recipe = await prisma.recipe.findUnique({
            where: {
                id: recipeId
            },
            select: {
                id: true,
                userId: true,
                title: true,
            }
        });

        // if the recipe doesn't exist, send a 404 error
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        // if the recipe exists but the author isn't the one attempting to delete (shouldn't happen)
        if (recipe.userId !== authorizedUser.user.id) {
            return res.status(403).json({ message: 'You do not have permission to delete this recipe.' });
        }

        // delete the recipe, cascading on schema should delete related records
        await prisma.recipe.delete({
            where: {
                id: recipeId
            }
        });

        res.status(200).json({ message: `Recipe: ${recipe.title} deleted successfully.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occured while attempting to delete the recipe. Please try again another time.'
        })
    }
})

exports.favorite_recipe = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const currentUser = authorizedUser.user;
    const recipeId = req.body.recipeId;

    try {
        const recipeToFavorite = await prisma.recipe.findFirst({
            where: {
                id: {
                    equals: recipeId,
                    mode: 'insensitive'
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    }
                }
            }
        });

        if (!recipeToFavorite) {
            return res.status(404).json({
                message: 'Recipe not found.'
            })
        }

        // Check to see if trying to favorite own recipe
        if (currentUser.id === recipeToFavorite.userId) {
            return res.status(400).json({
                message: 'You cannot favorite your own recipes.'
            });
        }

        const existingFavorite = await prisma.recipeFavorite.findFirst({
            where: {
                userId: currentUser.id,
                recipeId: recipeId
            }
        })

        if (existingFavorite) {
            return res.status(400).json({
                message: 'You have already favorited this recipe.'
            })
        }

        const favorite = await prisma.recipeFavorite.create({
            data: {
                userId: currentUser.id,
                recipeId: recipeId
            },
            include: {
                recipe: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        res.status(201).json({
            message: `You have favorited "${recipeToFavorite.title}".`,
            favorite
        })

    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({
            error: 'An error occured while following the user.'
        })
    }
})

exports.unfavorite_recipe = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const currentUser = authorizedUser.user;
    const recipeId = req.body.recipeId;

    try {
        const existingFavorite = await prisma.recipeFavorite.findFirst({
            where: {
                userId: currentUser.id,
                recipeId: recipeId
            },
            include: {
                recipe: {
                    select: {
                        title: true
                    }
                }
            }
        });

        if (!existingFavorite) {
            return res.status(400).json({
                message: `You have not favorited this recipe.`
            })
        }

        await prisma.recipeFavorite.delete({
            where: {
                id: existingFavorite.id
            }
        });

        res.status(201).json({
            message: `You have removed "${existingFavorite.recipe.title}" from your favorites.`,
        })

    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({
            error: 'An error occured while following the user.'
        })
    }
})

exports.toggle_favorite = asyncHandler(async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);

    const { recipeId } = req.params;

    try {
        // Check if recipe exists
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            select: { id: true, title: true }
        });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        // Check if already favorited
        const existingFavorite = await prisma.recipeFavorite.findFirst({
            where: {
                userId: authorizedUser.user.id,
                recipeId: recipeId
            }
        });


        if (existingFavorite) {
            // Unfavorite
            await prisma.recipeFavorite.delete({
                where: {
                    id: existingFavorite.id
                }
            });

            return res.status(200).json({
                message: `You have removed "${recipe.title}" from your favorites.`,
                isFavorited: false
            });
        } else {
            // Favorite
            const favorite = await prisma.recipeFavorite.create({
                data: {
                    userId: authorizedUser.user.id,
                    recipeId: recipeId
                }
            });

            return res.status(201).json({
                message: `You have favorited "${recipe.title}".`,
                isFavorited: true,
                favoriteId: favorite.id
            });
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ error: 'An error occured.' });
    }
});

exports.get_recipes_by_pantry = asyncHandler(async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const limit = parseInt(req.query.limit) || 5;
    const minMatchPercent = parseInt(req.query.minMatch) || 0; // Minimum match percentage, considering 5-10

    try {
        // Get user's pantry items
        const userPantry = await prisma.pantryUsers.findMany({
            where: {
                userId: authorizedUser.user.id
            },
            include: {
                pantryItem: {
                    include: {
                        ingredient: true
                    }
                }
            }
        });

        if (userPantry.length === 0) {
            return res.json({
                message: 'Your pantry is empty. Add some items to your pantry to get recommendations.',
                recipes: []
            });
        }

        // Get ingredient IDs from user's pantry
        const userIngredientIds = userPantry.map(p => p.pantryItem.ingredientId);

        // Get all recipes with their ingredients
        const allRecipes = await prisma.recipe.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true
                    }
                },
                ingredients: {
                    include: {
                        ingredient: true
                    }
                },
                recipeTags: {
                    select: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        favorites: true,
                        comments: true
                    }
                }
            }
        });

        // Calculate match percentage for each recipe
        const recipesWithMatch = allRecipes.map(recipe => {
            const recipeIngredientIds = recipe.ingredients.map(ing => ing.ingredientId);
            const totalIngredients = recipeIngredientIds.length;

            // Count matching ingredients
            const matchingIngredients = recipeIngredientIds.filter(id => 
                userIngredientIds.includes(id)
            );
            const matchCount = matchingIngredients.length;

            // Calculate percentage
            const matchPercentage = totalIngredients > 0 ? Math.round((matchCount / totalIngredients) * 100) : 0;

            // Get missing ingredients
            const missingIngredients = recipe.ingredients.filter(ing => !userIngredientIds.includes(ing.ingredientId)).map(ing => ({
                id: ing.ingredient.id,
                name: ing.ingredient.name,
                quantity: ing.quantity,
                measurement: ing.measurement
            }));

            // Get matching ingredient details
            const matchingIngredientsDetails = recipe.ingredients.filter(ing => userIngredientIds.includes(ing.ingredientId)).map(ing => ({
                id: ing.ingredient.id,
                name: ing.ingredient.name,
                quantity: ing.quantity,
                measurement: ing.measurement
            }));

            return {
                id: recipe.id,
                title: recipe.title,
                description: recipe.description,
                user: recipe.user,
                cookTime: recipe.cookTime,
                tags: recipe.recipeTags.map(rt => rt.tag),
                totalIngredients,
                matchCount,
                matchPercentage,
                matchingIngredients: matchingIngredientsDetails,
                missingIngredients,
                _count: recipe._count
            };
        });

        // Filter by minimum match percentage and sort by match percentage (highest first)
        // Added check to remove anything at 100% which is shown in Makeable - maybe delete ?
        const filteredRecipes = recipesWithMatch.filter(recipe => recipe.matchPercentage >= minMatchPercent && recipe.matchPercentage < 100).sort((a,b) => {
            // Primary sort: match percentage (descending)
            if (b.matchPercentage !== a.matchPercentage) {
                return b.matchPercentage - a.matchPercentage;
            }
            // Secondary sort: fewer missing ingredients
            return a.missingIngredients.length - b.missingIngredients.length;
        })
        .slice(0,limit)

        res.json({
            pantryItemCount: userPantry.length,
            recipeCount: filteredRecipes.length,
            recipes: filteredRecipes
        });
    } catch (error) {
        console.error('Error finding recipes by pantry:', error);
        res.status(500).json({ error: 'An error occured' });
    }
});

exports.get_makeable_recipes = asyncHandler(async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const limit = parseInt(req.query.limit) || 5;

    try {
        // get user's pantry ingredient IDs
        const userPantry = await prisma.pantryUsers.findMany({
            where: {
                userId: authorizedUser.user.id
            },
            include: {
                pantryItem: true,
            }
        });

        if (userPantry.length === 0) {
            return res.json({
                message: 'Your pantry is empty, add items to get makeable recipes.',
                recipes: []
            });
        }

        const userIngredientIds = userPantry.map(p => p.pantryItem.ingredientId);

        // Find recipes where ALL ingredients are in user's pantry
        const allRecipes = await prisma.recipe.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true
                    }
                },
                ingredients: {
                    include: {
                        ingredient: true
                    }
                },
                recipeTags: {
                    select: {
                        tag: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        favorites: true,
                        comments: true
                    }
                }
            }
        });

        const makeableRecipes = allRecipes.filter(recipe => {
            const recipeIngredientIds = recipe.ingredients.map(ing => ing.ingredientId);
            return recipeIngredientIds.every(id => userIngredientIds.includes(id));
        }).slice(0, limit)
        .map(recipe => ({
            id: recipe.id,
            description: recipe.description,
            user: recipe.user,
            title: recipe.title,
            cookTime: recipe.cookTime,
            tags: recipe.recipeTags.map(rt => rt.tag),
            totalIngredients: recipe.ingredients.length,
            matchPercentage: 100,
            ingredients: recipe.ingredients.map(ing => ({
                id: ing.ingredient.id,
                name: ing. ingredient.name,
                quantity: ing.quantity,
                measurement: ing.measurement
            })),
            _count: recipe._count
        }));

        res.json({
            pantryItemCount: userPantry.length,
            recipeCount: makeableRecipes.length,
            recipes: makeableRecipes
        })

    } catch (error) {
        console.error('Error finding makeable recipes:', error);
        res.status(500).json({ error: 'An error occured.' });
    }
});

exports.get_trending_recipes = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;

    const recipes = await prisma.recipe.findMany({
        orderBy: {
            favorites: {
                _count: 'desc'
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                }
            },
            recipeTags: {
                select: {
                    tag: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    favorites: true,
                    comments: true
                }
            }
        },
        take: limit
    });

    res.json({ recipes });
});

exports.get_recent_recipes = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;

    const recipes = await prisma.recipe.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    name: true
                }
            },
            recipeTags: {
                select: {
                    tag: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    favorites: true,
                    comments: true
                }
            }
        },
        take: limit
    });

    res.json({ recipes });
});

exports.batch_check_favorites = asyncHandler(async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const { recipeIds } = req.body;

    if (!recipeIds || !Array.isArray(recipeIds)) {
        return res.status(400).json({ message: 'recipeIds must be an array' });
    }

    try {
        const favorites = await prisma.recipeFavorite.findMany({
            where: {
                userId: authorizedUser.user.id,
                recipeId: {
                    in: recipeIds
                }
            },
            select: {
                recipeId: true,
            }
        });

        // Convert to object for easy lookup
        const favoriteStatus = {};
        recipeIds.forEach(id => {
            favoriteStatus[id] = favorites.some(fav => fav.recipeId === id);
        });

        res.json({ favoriteStatus });
    } catch (error) {
        console.error('Error checking favorite status:', error);
        res.status(500).json({ error: 'An error occured.' });
    }
});