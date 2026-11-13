const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.new_item = [
    body('item', 'Pantry items must not be empty')
            .trim()
            .isLength({ min: 1, max: 250 }),
    
    async (req, res, next) => {
        const errors = validationResult(req);
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
});

exports.get_pantry_by_user = asyncHandler(async (req, res) => {
    const currentUser = req.user;
    const page = Math.min(Math.max(parseInt(req.query.page) || 1, 1), 100000);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 16, 1), 24);

    const owner = await prisma.user.findFirst({
        where: {
            username: {
                equals: req.params.username,
                mode: 'insensitive'
            }
        },
        select: {
            id: true,
            username: true,
            name: true,
        }
    });

    if (!owner) return res.status(404).json({ error: 'User not found.' });

    const where = {userId: owner.id };

    const [items, total] = await Promise.all([
        prisma.pantryUsers.findMany({
            where,
            orderBy: [{ pantryItem: { name: 'asc' } }, { id: 'asc' }],
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                pantryItem: { select: { id: true, name: true } }
            }
        }),
        prisma.pantryUsers.count({ where })
    ]);

    const isOwnProfile = currentUser?.id === owner.id;

    let viewerItemIds = new Set();
    if (currentUser && !isOwnProfile && items.length > 0) {
        const viewerItems = await prisma.pantryUsers.findMany({
            where: {
                userId: currentUser.id,
                pantryItemId: { in: items.map(item => item.pantryItem.id) }
            },
            select: { pantryItemId: true }
        });
        viewerItemIds = new Set(viewerItems.map(v => v.pantryItemId));
    }

    res.json({ 
        user: owner,
        isOwnProfile,
        items: items.map(item => ({
            ...item,
            inMyPantry: viewerItemIds.has(item.pantryItem.id)
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit)
    });
})