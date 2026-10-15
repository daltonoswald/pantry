import { Link } from 'react-router-dom';
import kitchenImg from '../../assets/temp-stock-photos/kitchen.jpg'
import { GoHeartFill, GoHeart, GoClock } from 'react-icons/go';
import './recipe-cards.styles.css';
import useLoginRedirect from '../../utils/useLoginRedirect';
import useFavoriteRecipe from '../../utils/useFavoriteRecipes';


export default function MediumRecipeCard({ recipe, userStats }) {
    const goToLogin = useLoginRedirect();
    const { isFavorited, favoriteCount, toggle } = useFavoriteRecipe(recipe);

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
                                    ? <GoHeartFill className='favorited' onClick={toggle} />
                                    : <GoHeart className='not-favorited' onClick={toggle} />
                            ) : (
                                <GoHeart className='not-favorited' onClick={goToLogin} />
                            )}
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
                        <Link className='recipe-tag' to={`/search?q=${encodeURIComponent(tag.tag.name)}&t=tags`} key={tag.tag.name}>{tag.tag.name}</Link>
                    ))}
                </div>
            </div>
        </div>
    )
}