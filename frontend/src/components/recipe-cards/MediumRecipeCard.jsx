import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { favoriteRecipe, unfavoriteRecipe, toggleFavoriteRecipe } from '../../utils/utility';
import kitchenImg from '../../assets/temp-stock-photos/kitchen.jpg'
import { GoHeartFill, GoHeart, GoClock } from 'react-icons/go';
import './recipe-cards.styles.css';
import useLoginRedirect from '../../utils/useLoginRedirect';


export default function MediumRecipeCard({ recipe, userStats }) {
    const token = localStorage.getItem('pantryAuthToken');
    const [isFavorited, setIsFavorited] = useState(!!recipe.isFavorited);
    const [isPending, setIsPending] = useState(false);
    const [message, setMessage] = useState(null);
    const goToLogin = useLoginRedirect();

    useEffect(() => {
        setIsFavorited(!!recipe.isFavorited);
    }, [recipe.isFavorited]);

    const favoriteCount = recipe._count.favorites + (isFavorited ? 1 : 0) - (recipe.isFavorited ? 1 : 0);

    const handleToggleFavoriteRecipe = async () => {
        if (isPending) return;
        const previous = isFavorited;
        setIsFavorited(!previous);
        setIsPending(true);

        const result = await toggleFavoriteRecipe(recipe.id)

        setIsPending(false);

        if (result.success) {
            setIsFavorited(result.isFavorited);
        } else {
            setIsFavorited(previous);
        }
    }

    return (
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
                            {userStats ? (
                                isFavorited
                                    ? <GoHeartFill className='favorited' onClick={handleToggleFavoriteRecipe} />
                                    : <GoHeart className='not-favorited' onClick={handleToggleFavoriteRecipe} />
                            ) : (
                                <GoHeart className='not-favorited' onClick={goToLogin} />
                            )}
                            {/* {(recipe.isFavorited && userStats) && (
                                <GoHeartFill className='favorited' onClick={() => handleToggleFavoriteRecipe(recipe.id)} />
                            )}
                            {(!recipe.isFavorited && userStats) && (
                                <GoHeart className='not-favorited' onClick={() => handleToggleFavoriteRecipe(recipe.id)} />
                            )}
                            {(!recipe.isFavorited && !userStats) && (
                                <GoHeart className='not-favorited' onClick={() => navigate('/login')} />
                            )} */}
                            <p>{favoriteCount}</p>
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
                        <Link className='recipe-tag' to={`/search?q=${tag.tag.name}&t=tags`} key={tag.tag.name}>{tag.tag.name}</Link>
                    ))}
                </div>
            </div>
        </div>
    )
}