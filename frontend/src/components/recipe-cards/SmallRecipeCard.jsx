import { Link } from 'react-router-dom';
import kitchenImg from '../../assets/temp-stock-photos/kitchen.jpg'
import { GoHeartFill, GoHeart, GoClock } from 'react-icons/go';
import './recipe-cards.styles.css';
import useLoginRedirect from '../../utils/useLoginRedirect';
import useFavoriteRecipe from '../../utils/useFavoriteRecipes';
export default function SmallRecipeCard({ recipe, userStats }) {
        const goToLogin = useLoginRedirect();
        const { isFavorited, favoriteCount, toggle } = useFavoriteRecipe(recipe);
    

    return (
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
                            {userStats ? (
                                isFavorited
                                    ? <GoHeartFill className='favorited' onClick={toggle} />
                                    : <GoHeart className='not-favorited' onClick={toggle} />
                            ) : (
                                <GoHeart className='not-favorited' onClick={goToLogin} />
                            )}
                            <p>{favoriteCount}</p>
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
    )
}