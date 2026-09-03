import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import kitchenImg from '../../assets/temp-stock-photos/kitchen.jpg'
import { favoriteRecipe, toggleFavoriteRecipe, unfavoriteRecipe } from '../../utils/utility';
import { GoHeartFill, GoHeart, GoClock } from 'react-icons/go';
import { MdArrowRightAlt } from 'react-icons/md'

export default function MakeableRecipes({ makeableRecipes, recipesByPantry, userStats }) {
    const navigate = useNavigate();
    
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

    if (!userStats) return (
        <div className='homepage-auth-container'>
            <div className='homepage-auth-container-tl'></div>
            <div className='homepage-auth-container-br'></div>
            <h3>Want to find recipes you can make today?</h3>
            <p><Link to='/sign-up'>Sign up</Link> or <Link to='login'>Log in</Link> and create your pantry.</p>
            <p>Join today and add ingredients to your pantry to find personalized recipes that you can make. Expand your palate and discover new flavors.</p>
        </div>
    )

    if (userStats) return (
        <>
            {makeableRecipes.length > 0 && (
                <section className='makeable-container'>
                    <div className='homepage-title-container'>
                        <h2>Within Your Pantry</h2>
                        <div className='homepage-subtitle'>
                            <p>Meals you can make today.</p>
                            <Link to='/recipes/all-makeable'>View All<MdArrowRightAlt /></Link>
                        </div>
                    </div>
                    <div className='makeable-recipe-card-container'>
                        {makeableRecipes.map(recipe => (
                            <div className='small-recipe-card'>
                                <div className='small-recipe-image-container'>
                                    <Link to={`/recipe/${recipe.id}`}>
                                        <img src={recipe.image || kitchenImg} className='small-recipe-image' alt='recipe image' />
                                    </Link>
                                </div>
                                <div className='small-recipe-about'>
                                    <div className='small-recipe-stats'>
                                        <p>From <Link to={`/user/${recipe.user.username}`}>{recipe.user.username}</Link></p>
                                        <div className='small-recipe-counts'>
                                            <p className='small-recipe-match-percentage'>
                                                {recipe.matchPercentage}% Match
                                            </p>
                                            <div className='small-recipe-favorites'>
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
                                            <div className='small-recipe-time'>
                                                <GoClock />
                                                <p>{recipe.cookTime} mins</p>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className='small-recipe-title'>
                                        <Link to={`/recipe/${recipe.id}`} className='small-recipe-title-link'>{recipe.title}</Link>
                                    </h3>
                                    <p>{recipe.description}</p>
                                    <div className='tag-container'>
                                        {recipe.recipeTags.map(tag => (
                                            <Link className='recipe-tag' to={`search?q=${tag.name}&t=tags`} key={tag.name}>{tag.name}</Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            
            {recipesByPantry.length > 0 && (
                <section className='makeable-container  by-pantry-container'>
                    <div className='homepage-title-container'>
                        <h2>Almost Ready</h2>
                        <div className='homepage-subtitle'>
                            <p>A quick stop at the store for even more meals.</p>
                            <Link to='/recipes/all-by-pantry'>View All<MdArrowRightAlt /></Link>
                        </div>
                    </div>
                    <div className='makeable-recipe-card-container'>
                        {recipesByPantry.map(recipe => (
                            <div className='small-recipe-card by-pantry-card'>
                                <div className='small-recipe-image-container'>
                                    <Link to={`/recipe/${recipe.id}`}>
                                        <img src={recipe.image || kitchenImg} className='small-recipe-image' alt='recipe image' />
                                    </Link>
                                </div>
                                <div className='small-recipe-about'>
                                    <div className='small-recipe-stats'>
                                        <p>From <Link to={`/user/${recipe.user.username}`}>{recipe.user.username}</Link></p>
                                        <div className='small-recipe-counts'>
                                            <p className='small-recipe-match-percentage'>
                                                {recipe.matchPercentage}% Match
                                            </p>
                                            <div className='small-recipe-favorites'>
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
                                            <div className='small-recipe-time'>
                                                <GoClock />
                                                <p>{recipe.cookTime} mins</p>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className='small-recipe-title'>
                                        <Link to={`/recipe/${recipe.id}`} className='small-recipe-title-link'>{recipe.title}</Link>
                                    </h3>
                                    <p>{recipe.description}</p>
                                    <div className='tag-container'>
                                        {recipe.recipeTags.map(tag => (
                                            <Link className='recipe-tag' to={`search?q=${tag.name}&t=tags`} key={tag.name}>{tag.name}</Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {(recipesByPantry.length <= 0 || makeableRecipes.length <= 0) && (
            <section className='empty-pantry-container'>
                    <div className='homepage-auth-container-tl'></div>
                    <div className='homepage-auth-container-br'></div>
                    <h3>Want to find recipes you can make today?</h3>
                    <p>Add ingredients to your pantry to find personalized recipes you can make.</p>
                </section>
            )}
        </>
    )

}