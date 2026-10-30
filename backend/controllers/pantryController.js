const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../middleware/middleware');

exports.new_item = [
    body('item', 'Pantry items must not be empty')
            .trim()
            .isLength({ min: 1, max: 250 }),
    
    async (req, res, next) => {
        const errors = validationResult(req);
        // const token = req.headers.authorization.split(' ')[1];
        // const authorizedUser = verifyToken(token);
        const currentUser = req.user;
        const tokenUserId = req.user.id
        const pantryItemName = req.body.item.toLowerCase();

        try {
            const result = await prisma.$transaction(async (prisma) => {
                // Find or create the ingredient in the Master List
                const ingredient = await prisma.ingredientMasterList.upsert({
                    where: {
                        name: pantryItemName
                    },
                    update: {},
                    create: {
                        name: pantryItemName,
                        // ingredientId: ingreidnet.id
                    }
                });
                // Find or create the pantry item
                const pantryItem = await prisma.pantryItem.upsert({
                    where: {
                        name: pantryItemName
                    },
                    update: {},
                    create: {
                        name: pantryItemName,
                        ingredientId: ingredient.id
                    }
                })
                // Check if the user already has the item in their Pantry
                const existingPantryUser = await prisma.pantryUsers.findUnique({
                    where: {
                        userId_pantryItemId: {
                            userId: tokenUserId,
                            pantryItemId: pantryItem.id
                        }
                    }
                });
                // If User doesn't own it, add it
                if (!existingPantryUser) {
                    const newPantryUser = await prisma.pantryUsers.create({
                        data: {
                            userId: tokenUserId,
                            pantryItemId: pantryItem.id
                        }
                    });
                    return { added: true, pantryUser: newPantryUser };
                }
                return { added: false, message: `${pantryItemName} is already in your pantry.`}
            });

            if (result.added) {
                res.json({ 
                    message: `${pantryItemName} added to your pantry.`,
                    success: true,
                    pantryUser: result.pantryUser 
                });
            } else {
                res.json({ message: `${pantryItemName} is already in your pantry.` })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to add pantry item.' });
        }
    }
]

exports.delete_from_pantry = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // const token = req.headers.authorization.split(' ')[1];
    // const authorizedUser = verifyToken(token);
    const currentUser = req.user;
    const tokenUserId = req.user.id;
    const { pantryUsersToDelete, item } = req.body;

    if (!pantryUsersToDelete && !item) {
        return res.status(400).json({ message: 'Nothing to remove.' });
    }

    try {
        const result = await prisma.pantryUsers.deleteMany({
            where: {
                userId: req.user.id,
                ...(pantryUsersToDelete
                    ? { id: pantryUsersToDelete }
                    : { pantryItem: { name: item.toLowerCase().trim() } })
            }
        });

        if (result.count === 0) {
            return res.status(404).json({ message: 'That item was not in your pantry.' });
        }
        res.status(202).json({ message: `${item} removed from your pantry.`, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not remove that item.' });
    }
})