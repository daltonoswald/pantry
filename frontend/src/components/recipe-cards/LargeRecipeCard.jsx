import { Link } from 'react-router-dom';
import kitchenImg from '../../assets/temp-stock-photos/kitchen.jpg'
import { GoHeartFill, GoHeart, GoClock } from 'react-icons/go';
import './recipe-cards.styles.css';
import useLoginRedirect from '../../utils/useLoginRedirect';
import useFavoriteRecipe from '../../utils/useFavoriteRecipes';
import { useAuth } from '../../context/AuthContext';

export default function LargeRecipeCard ({ recipe }) {
    const goToLogin = useLoginRedirect();
    const { isFavorited, favoriteCount, toggle } = useFavoriteRecipe(recipe);
    const { isLoggedIn } = useAuth();
    
    return (
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
                            {isLoggedIn ? (
                                isFavorited
                                    ? <GoHeartFill className='favorited' onClick={toggle} />
                                    : <GoHeart className='not-favorited' onClick={toggle} />
                            ) : (
                                <GoHeart className='not-favorited' onClick={goToLogin} />
                            )}
                            <p>{favoriteCount}</p>
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
    )
}