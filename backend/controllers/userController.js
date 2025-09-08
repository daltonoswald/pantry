const asyncHandler = require('express-async-handler');
const { body, valdiationResult, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../middleware/middleware');


exports.log_in = asyncHandler(async (req, res, next) => {
    console.log('hi')
    console.log(req.body.username)
    const user = await prisma.user.findFirst({
        where: {
            username: {
                equals: req.body.username,
                mode: 'insensitive'
            }
        }
    });
    if (!user) {
        return res.status(404).json({ message: 'Username not found, Username may be case-sensitive.' });
    }
    try {
        bcryptjs.compare(req.body.password, user.password, (err, isMatch) => {
            if (err) return next(err);

            const options = {};
            options.expiresIn = '7d';
            const token = jwt.sign({ user }, process.env.TOKEN_KEY || TOKEN_KEY, options);

            if (!isMatch) {
                res.status(404).json({ message: "Incorrect username or password." });
            } else {
                res.json({ message: 'User logged in sucessfully', token, user });
            }
        })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
})

exports.sign_up = [
    body('name', 'Name must not be empty.')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('username', 'Username must not be empty.')
        .trim()
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('password', 'Password must be between 8 and 50 characters.')
        .trim()
        .isLength({ min: 8, max: 50 })
        .escape(),
    body('confirm_password', 'The passwords do not match.')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                return false
            }
            return true
        }),
    body('bio')
        .trim()
        .escape(),

    async(req, res, next) => {
        try {
            const errors = validationResult(req)
            if (req.body.password !== req.body.confirm_password) {
                res.status(409).json({ message: "Passwords do not match." });
            }

            const usernameTaken = await prisma.user.findMany({
                where: {
                    username: {
                        equals: req.body.username,
                        mode: 'insensitive'
                    }
                }
            });
            if (!errors.isEmpty()) {
                const errorsMessages = errors.array().map((error) => error.msg);
                res.json({ message: errorsMessages });
            } else {
                if (usernameTaken.length > 0) {
                    res.status(409).json({ message: "Username is already in use." })
                    return;
                } else {
                    await prisma.user.create({
                        data: {
                            name: req.body.name,
                            username: req.body.username,
                            password: await bcryptjs.hash(req.body.password, 10),
                            bio: req.body.bio,
                        }
                    })
                    res.json({ message: 'User successfully created.' });
                    res.redirect('/');
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
]

exports.profile = asyncHandler(async (req, res, next) => {
    console.log('test');
    try {
        const token = req.headers.authorization.split(' ')[1];
        const authorizedUser = verifyToken(token);
        const userToFind = req.body.userToFind;
        const userProfile = await prisma.user.findFirst({
            where: {
                username: {
                    equals: userToFind,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                name: true,
                username: true,
                bio: true,
                followed_by: {
                    select: {
                        followed_by: {
                            select: {
                                id: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {followed_by: true, following: true }
                },
                recipes: {
                    select: {
                        id: true,
                        description: true,
                        title: true,
                    }
                },
                recipe_favorites: {
                    select: {
                        recipe: {
                            select: {
                                id: true,
                                title: true,
                            }
                        }
                    }
                }
            }
        })
        if (!userProfile) {
            res.status(404).json({error: 'User not found.'})
        } else {
            console.log(userProfile);
            res.json({ profile: userProfile, user: authorizedUser });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({error: err})
    }
})