const asyncHandler = require('express-async-handler');
const { body, valdiationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.search = asyncHandler(async (req, res, next) => {
    const { query, type } = req.query;
    console.log(query, type)
    if (!query || query.trim().length === 0) {
        return res.status(400).json({ message: 'Search query is required.' });
    }

    const searchTerm = query.toLowerCase().trim();

    try {
        let results = {};

        // Search Users (if term is all or users)
        if (!type || type === 'all' || type === 'users') {
            results.users = await prisma.user.findMany({
                where: {
                    OR: [
                        { username: { contains: searchTerm, mode: 'insensitive' } },
                        { name: { contains: searchTerm, mode: 'insensitive' } },
                        { bio: { contains: searchTerm, mode: 'insensitive' } }
                    ]
                },
                select: {
                    id: true,
                    username: true,
                    bio: true,
                    _count: {
                        select: {
                            recipes: true,
                            following: true,
                            followedBy: true
                        }
                    }
                },
                // returns first 5, change later ?
                take: 5
            });
        }

        // Search recipes (if term is all or recipes)
        if (!type || type === 'all' || type === 'recipes') {
            results.recipes = await prisma.recipe.findMany({
                where: {
                    OR: [
                        { title: { contains: searchTerm, mode: 'insensitive' } },
                        { description: { contains: searchTerm, mode: 'insensitive' } },
                        // Potentially get rid of directions in search ?
                        { directions: { contains: searchTerm, mode: 'insensitive' } },
                    ]
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
                        include: {
                            tag: true
                        }
                    },
                    _count: {
                        select: {
                            favorites: true,
                            comments: true
                        }
                    }
                },
                // returns first 5, change later ?
                take: 5
            });
        }

        // Search Ingredients (if term is all or ingredients)
        if (!type || type === 'all' || type === 'ingredients') {
            const ingredients = await prisma.ingredientMasterList.findMany({
                where: {
                    name: { contains: searchTerm, mode: 'insensitive' }
                },
                include: {
                    recipeIngredients: {
                        include: {
                            recipe: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            username: true,
                                            name: true
                                        }
                                    },
                                    recipeTags: {
                                        include: {
                                            tag: true
                                        }
                                    }
                                }
                            }
                        },
                        take: 5
                    },
                    _count: {
                        select: {
                            recipeIngredients: true,
                            pantryItem: true
                        }
                    }
                },
                take: 20
            });
            results.ingredients = ingredients.map(ing => ({
                id: ing.id,
                name: ing.name,
                recipeCount: ing._count.recipeIngredients,
                pantryItemCount: ing._count.pantryItem,
                recipes: ing.recipeIngredients.map(ri => ri.recipe)
            }));
        }

        if (!type || type === 'all' || type === 'tags') {
            const tags = await prisma.tagMasterList.findMany({
                where: {
                    name: { contains: searchTerm, mode: 'insensitive' }
                },
                include: {
                    recipeTags: {
                        include: {
                            recipe: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            username: true,
                                            name: true
                                        }
                                    },
                                    recipeTags: {
                                        include: {
                                            tag: true
                                        }
                                    }
                                }
                            }
                        },
                        take: 5
                    },
                    _count: {
                        select: {
                            recipeTags: true
                        }
                    }
                },
                take: 20
            });

            results.tags = tags.map(tag => ({
                id: tag.id,
                name: tag.name,
                recipeCount: tag._count.recipeTags,
                recipes: tag.recipeTags.map(rt => rt.recipe)
            }));
        }

        // Calculate totals of each
        const totals = {
            users: results.users?.length || 0,
            recipes: results.recipes?.length || 0,
            ingredients: results.ingredients?.length || 0,
            tags: results.tags?.length || 0,
            total:  (results.users?.length || 0) +
                    (results.recipes?.length || 0) +
                    (results.ingredients?.length || 0) +
                    (results.tags?.length || 0)
        };

        res.json({
            query: searchTerm,
            totals,
            results
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'An error occurred during search.' });
    }
});