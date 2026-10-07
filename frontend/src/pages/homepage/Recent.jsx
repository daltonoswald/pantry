import { useNavigate, Link } from 'react-router-dom';
import { favoriteRecipe, unfavoriteRecipe, toggleFavoriteRecipe } from '../../utils/utility';
import kitchenImg from '../../assets/temp-stock-photos/kitchen.jpg'
import { GoHeartFill, GoHeart, GoClock } from 'react-icons/go';
import { MdArrowRightAlt } from 'react-icons/md'
import useLoginRedirect from '../../utils/useLoginRedirect';
import MediumRecipeCard from '../../components/recipe-cards/MediumRecipeCard';


export default function Recent({ recentRecipes, userStats }) {

    console.log('r', recentRecipes);

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
                            <MediumRecipeCard recipe={recipe} userStats={userStats} />
                        ))}
                    </div>
                </section>
            )}
        </>
    )
}