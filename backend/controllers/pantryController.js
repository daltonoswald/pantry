const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../middleware/middleware');

// exports.new_item = [
//     body('item', 'Pantry items must not be empty')
//         .trim()
//         .isLength({ min: 1, max: 250 })
//         .escape(),

//     async (req, res, next) => {
//         try {
//             const errors = validationResult(req);
//             const token = req.headers.authorization.split(' ')[1];
//             const authorizedUser = verifyToken(token);
//             const tokenUserId = authorizedUser.user.id;
//             const pantryItemName = req.body.item.toLowerCase();

//             const pantryItemExists = await prisma.pantryItem.findUnique({
//                 where: {
//                     name: pantryItemName
//                 }
//             })

//             console.log('Does it exist?', pantryItemExists)

//             if (!errors.isEmpty()) {
//                 const errorsMessages = errors.array().map((error) => error.msg);
//                 res.json({ message: errorsMessages });
//             } else {
//                     const alreadyExists = await prisma.ingredientMasterList.findFirst({
//                         where: {
//                             name: pantryItemName,
//                         },
//                         include: {
//                             pantryItem: {
//                                 include: {
//                                     ownedBy: {
//                                         where: {
//                                             userId: tokenUserId
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     })

//                     if (!alreadyExists) {
//                         const newPantryItem = await prisma.ingredientMasterList.create({
//                             data: {
//                                 name: pantryItemName,
//                                 pantryItem: {
//                                     create: {
//                                         name: pantryItemName,
//                                         ownedBy: {
//                                             create: {
//                                                 userId: tokenUserId
//                                             }
//                                         }
//                                     }
//                                 }
//                             }
//                         })
//                         res.json({ message: `${pantryItemName} added to your pantry.`, newPantryItem: newPantryItem })
//                     } else if (alreadyExists.pantryItem[0].ownedBy.length >= 1) {
//                         res.json({ message: `${pantryItemName} is already in your pantry.`})
//                     } else {
//                         const addNewPantryUser = await prisma.pantryItem.update({
//                             where: {
//                                 name: pantryItemName,
//                             },
//                             data: {
//                                 ownedBy: {
//                                     create: {
//                                         userId: tokenUserId
//                                     }
//                                 }
//                             }
//                         })
//                         res.json({ message: `${pantryItemName} added to your pantry.`, newPantryItem: addNewPantryUser })
//                     }

//                 } 
//         } catch (err) {
//             console.log(err);
//             return next(err);
//         }
//     }
// ]

exports.new_item = [
    body('item', 'Pantry items must not be empty')
            .trim()
            .isLength({ min: 1, max: 250 })
            .escape(),
    
    async (req, res, next) => {
        const errors = validationResult(req);
        const token = req.headers.authorization.split(' ')[1];
        const authorizedUser = verifyToken(token);
        const tokenUserId = authorizedUser.user.id;
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
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    console.log(req.body.pantryUsersToDelete);

    try {
        const pantryUsersToDelete = await prisma.pantryUsers.delete({
            where: {
                id: req.body.pantryUsersToDelete,
                userId: authorizedUser.user.id
            }
        })
        res.status(202).json({ message: 'Removed from your pantry'})
    } catch (err) {
        console.error(err);
        res.json({ error: err });
    }
})