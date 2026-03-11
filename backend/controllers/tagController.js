const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.get_popular_tags = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;

    const tags = await prisma.tagMasterList.findMany({
        include: {
            _count: {
                select: {
                    recipeTags: true
                }
            }
        },
        orderBy: {
            recipeTags: {
                _count: 'desc'
            }
        },
        take: limit
    });

    const formattedTags = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        recipeCount: tag._count.recipeTags
    }));

    res.json({ tags: formattedTags });
})