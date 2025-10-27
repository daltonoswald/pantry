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
        .isLength({ min: 1, max: 250 })
        .escape(),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            const token = req.headers.authorization.split(' ')[1];
            const authorizedUser = verifyToken(token);
            const tokenUserId = authorizedUser.user.id;
            const pantryItemName = req.body.item.toLowerCase();
            console.log(req.body.item)
            console.log(pantryItemName)

            const pantryItemExists = await prisma.pantryItem.findUnique({
                where: {
                    name: pantryItemName
                }
            })

            // Need to finish making the pantry item if it doesn't exist and adding the user to the ownedBy if it does exist.
            if (!errors.isEmpty()) {
                const errorsMessages = errors.array().map((error) => error.msg);
                res.json({ message: errorsMessages });
            } else {
                if (pantryItemExists) {
                    console.log('if', pantryItemName);
                    res.json({ message: 'If'})
                } else {
                    console.log('else', pantryItemName)
                    res.json({ message: 'Else'})
                }
            }
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }
]