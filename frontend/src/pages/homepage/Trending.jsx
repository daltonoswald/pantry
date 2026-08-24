import { useNavigate, Link } from 'react-router-dom';
import { Clock, GraphUp, Heart, HeartFill,  Stopwatch } from 'react-bootstrap-icons';
import { GoClock, GoHeart, GoHeartFill } from 'react-icons/go'
import { Badge, Button, Col, Card, Row } from 'react-bootstrap';
import { favoriteRecipe, unfavoriteRecipe, toggleFavoriteRecipe } from '../../utils/utility';
import kitchenImg from '../../assets/temp-stock-photos/kitchen.jpg'
import './homepage.css'


export default function Trending({trendingRecipes, popularTags, userStats }) {
    const navigate = useNavigate();
    console.log('t', trendingRecipes);

    const handleToggleFavoriteRecipe = async (recipeId) => {

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
            {trendingRecipes.length > 0 && (
                <section className='trending-container'>
                    <div className='homepage-title-container'>
                        <p className='tagline'>The Current Pulse</p>
                        <h2>Trending in the Kitchen</h2>
                    </div>
                    <div className='trending-recipe-card-container'>
                        {trendingRecipes.map(recipe => (
                            <div className='large-recipe-card'>
                                <div className='large-recipe-image-container'>
                                    <Link to={`/recipe/${recipe.id}`}> 
                                        <img src={recipe.image || kitchenImg} className='large-recipe-image' alt='recipe image' />
                                    </Link>
                                </div>
                                <div className='large-recipe-about'>
                                    <div className='large-recipe-about-stats'>
                                        <p>From <Link to={`/user/${recipe.user.username}`}>{recipe.user.name}</Link></p>
                                        <div className='large-recipe-favorites-time'>
                                            <div className='large-recipe-favorites'>
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
                                            <div className='large-recipe-time'>
                                                <GoClock />
                                                <p>{recipe.cookTime} mins</p>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className='large-recipe-title'>
                                        <Link to={`/recipe/${recipe.id}`} className='large-recipe-title-link'>{recipe.title}</Link>
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