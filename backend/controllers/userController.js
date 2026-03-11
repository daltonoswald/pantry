const asyncHandler = require('express-async-handler');
const { body, valdiationResult, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../middleware/middleware');
const { authorize } = require('passport');


exports.log_in = asyncHandler(async (req, res, next) => {
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
    body('email', 'E-mail must not be empty.')
        .trim()
        .isLength({ min: 1, max: 100 })
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
            const emailTaken = await prisma.user.findMany({
                where: {
                    email: {
                        equals: req.body.email,
                        mode: 'insensitive',
                    }
                }
            });
            if (!errors.isEmpty()) {
                const errorsMessages = errors.array().map((error) => error.msg);
                res.json({ message: errorsMessages });
            } else {
                if (usernameTaken.length > 0 || emailTaken.length > 0) {
                    res.status(409).json({ message: "Username or E-mail is already in use." })
                    return;
                } else {
                    await prisma.user.create({
                        data: {
                            name: req.body.name,
                            username: req.body.username,
                            email: req.body.email,
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
    try {
        // const token = req.headers.authorization.split(' ')[1];
        // const authorizedUser = verifyToken(token);
        const currentUser = req.user; // Set by optionalAuth middleware
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
                username: true,
                name: true,
                bio: true,
                recipes: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        createdAt: true,
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
                                comments: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 10
                },
                recipeFavorites: {
                    select: {
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
                    },
                    take: 10
                },
                pantryItems: {
                    select: {
                        id: true,
                        pantryItem: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        recipes: true,
                        following: true,
                        followedBy: true,
                        recipeFavorites: true
                    }
                },
                followedBy: currentUser ? {
                    where: {
                        followedById: currentUser.id
                    }
                } : false,
                following: currentUser ? {
                    where: {
                        followingId: currentUser.id
                    }
                } : false
            }
        });

        if (!userProfile) {
            return res.status(404).json({ error: 'User not found.' })
        } else {
            // res.json({ profile: userProfile, user: authorizedUser });
            res.json({
                userProfile,
                ...(currentUser && {
                    currentUser: {
                        id: currentUser.id,
                        username: currentUser.username
                    },
                    isOwnProfile: userProfile.id === currentUser.id,
                    isFollowing: userProfile.followedBy?.length > 0,
                    followsYou: userProfile.following?.length > 0
                })
            });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'An error occured while fetching the user.' })
    }
})

exports.get_user_stats = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const currentUser = authorizedUser.user
    try {
        const stats = await prisma.user.findFirst({
            where: {
                username: {
                    equals: currentUser.username,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                username: true,
                pantryItems: {
                    select: {
                        id: true,
                        pantryItem: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        recipes: true,
                        following: true,
                        followedBy: true,
                        recipeFavorites: true
                    }
                },
            }
        });

        if (!stats) {
            return res.status(404).json({ error: 'User not found.' })
        } else {
            res.json({
                stats,
            });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'An error occured while fetching the user.' })
    }
})


exports.follow_user = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const currentUser = authorizedUser.user
    const usernameToFollow = req.body.userToFollow

    try {
        const userToFollow = await prisma.user.findFirst({
            where: {
                username: usernameToFollow
            },
            select: {
                id: true,
                username: true,
                name: true
            }
        });

        if (!userToFollow) {
            return res.status(404).json({
                messasge: 'User not found.'
            })
        }

        // Check to see if trying to follow self
        if (userToFollow.id === currentUser.id) {
            return res.status(400).json({
                message: 'You cannot follow yourself.'
            });
        }

        const existingFollow = await prisma.follows.findUnique({
            where: {
                followingId_followedById: {
                    followingId: userToFollow.id,
                    followedById: currentUser.id
                }
            }
        });

        if (existingFollow) {
            return res.status(400).json({
                message: `You are already following ${userToFollow.username}.`
            });
        }

        const follow = await prisma.follows.create({
            data: {
                followingId: userToFollow.id,   // User being followed
                followedById: currentUser.id    // Current User
            }
        });

        res.status(200).json({
            message: `You are now following ${userToFollow.username}.`,
            follow: {
                followingUser: userToFollow,
                followedByUser: {
                    id: currentUser.id,
                    username: currentUser.username
                },
                currentUser: currentUser
            }
        });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({
            error: 'An error occured while following the user.'
        })
    }
});

exports.unfollow_user = asyncHandler(async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const authorizedUser = verifyToken(token);
    const currentUser = authorizedUser.user
    const usernameToUnfollow = req.body.userToFollow;

    try {
        // Find user to unfollow
        const userToUnfollow = await prisma.user.findFirst({
            where: {
                username: usernameToUnfollow
            },
            select: {
                id: true,
                username: true
            }
        });

        if (!userToUnfollow) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        const existingFollow = await prisma.follows.findUnique({
            where: {
                followingId_followedById: {
                    followingId: userToUnfollow.id,
                    followedById: currentUser.id
                }
            }
        });

        if (!existingFollow) {
            return res.status(400).json({
                message: `You are not following ${userToUnfollow.username}.`
            });
        }

        await prisma.follows.delete({
            where: {
                followingId_followedById: {
                    followingId: userToUnfollow.id,
                    followedById: currentUser.id
                }
            }
        });

        res.status(200).json({
            message: `You have unfollowed ${userToUnfollow.username}.`
        })
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({
            error: 'An error occured while unfollowing user.'
        })
    }
})

exports.edit_profile =[
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Name must be between 1 and 50 characters.')
        .escape(),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must be less than 500 characters')
        .escape(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const token = req.headers.authorization.split(' ')[1];
        const authorizedUser = verifyToken(token);
        const currentUser = authorizedUser.user;
        const { name, bio } = req.body;
        console.log(req.body.editData);

        // Build update data with only provided fields
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: 'No fields provided to update.'
            });
        }

        try {
            const updatedUser = await prisma.user.update({
                where: {
                    id: currentUser.id
                },
                data: updateData,
                select: {
                    id: true,
                    username: true,
                    name: true,
                    email: true,
                    bio: true
                }
            });

            res.json({
                message: 'Profile updated successfully.',
                user: updatedUser,
                currentUser: currentUser
            })
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({
                error: 'An error occured while updating user.'
            })
        }
    })
]