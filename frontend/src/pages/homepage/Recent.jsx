import { useNavigate, Link } from 'react-router-dom';
import { favoriteRecipe, unfavoriteRecipe, toggleFavoriteRecipe } from '../../utils/utility';
import kitchenImg from '../../assets/temp-stock-photos/kitchen.jpg'
import { GoHeartFill, GoHeart, GoClock } from 'react-icons/go';
import { MdArrowRightAlt } from 'react-icons/md'


export default function Recent({ recentRecipes, userStats }) {

    const navigate = useNavigate();
    console.log('r', recentRecipes);

    const handleToggleFavoriteRecipe = async (recipeId) => {
        // setMessage(null);

        console.log('toggling: ', recipeId)
        const result = await toggleFavoriteRecipe(recipeId)

        if (result.success) {
            // setMessage({ type: 'success', text: result.message });
            window.location.reload();
        } else {
            // setMessage({ type: 'danger', text: result.message || 'Failed to favorite recipe.'})
        }
    }

    return (
        <>
            {recentRecipes.length > 0 && (
                <section className='recent-container'>
                    <div className='homepage-title-container'>
                        <p className='tagline'>Fresh From the Oven</p>
                        <h2>Recent Recipes</h2>
                        <div className='homepage-subtitle'>
                            <p>The newest recipes.</p>
                            <Link to='/recipes/new'>View All<MdArrowRightAlt /></Link>
                        </div>
                    </div>
                    <div className='recent-recipe-card-container'>
                        {recentRecipes.map(recipe => (
                            <div className='medium-recipe-card'>
                                <div className='medium-recipe-image-container'>
                                    <Link to={`/recipe/${recipe.id}`}>
                                        <img src={recipe.image || kitchenImg} className='medium-recipe-image' alt='recipe image' />
                                    </Link>
                                </div>
                                <div className='medium-recipe-about'>
                                    <div className='medium-recipe-stats'>
                                        <p>From <Link to={`/user/${recipe.user.username}`}>{recipe.user.username}</Link></p>
                                        <div className='medium-recipe-counts'>
                                            <div className='medium-recipe-favorites'>
                                                {(recipe.isFavorited && userStats) && (
                                                    <GoHeartFill className='favorited' onClick={() => handleToggleFavoriteRecipe(recipe.id)} />
                                                )}
                                                {(!recipe.isFavorited && userStats) && (
                                                    <GoHeart className='not-favorited' onClick={() => handleToggleFavoriteRecipe(recipe.id)} />
                                                )}
                                                {(!recipe.isFavorited && !userStats) && (
                                                    <GoHeart className='not-favorited' onClick={() => navigate('/login')} />
                                                )}
                                                <p>{recipe._count.favorites}</p>
                                            </div>
                                            <div className='medium-recipe-time'>
                                                <GoClock />
                                                <p>{recipe.cookTime} mins</p>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className='medium-recipe-title'>
                                        <Link to={`/recipe/${recipe.id}`} className='medium-recipe-title-link'>{recipe.title}</Link>
                                    </h3>
                                    <p>{recipe.description}</p>
                                    <div className='tag-container'>
                                        {recipe.recipeTags.map(tag => (
                                            <Link className='recipe-tag' to={`search?q=${tag.tag.name}&t=tags`} key={tag.tag.name}>{tag.tag.name}</Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </>
    )
}