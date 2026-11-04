const recipeCardInclude = (currentUser) => ({
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
    },
    favorites: currentUser
        ? {
            where: {
                userId: currentUser.id
            },
            select: {
                id: true
            }
        } : false,
});

// Turns the raw favorites relation into the isFavorited boolean the cards read
const toRecipeCard = ({ favorites, ...recipe }) => ({
    ...recipe,
    isFavorited: !!favorites?.length,
});

module.exports = { recipeCardInclude, toRecipeCard };