import { useNavigate, Link } from 'react-router-dom';
import { GoClock, GoHeart, GoHeartFill } from 'react-icons/go'
import { favoriteRecipe, unfavoriteRecipe, toggleFavoriteRecipe } from '../../utils/utility';
import kitchenImg from '../../assets/temp-stock-photos/kitchen.jpg'
import './homepage.css'
import useLoginRedirect from '../../utils/useLoginRedirect';
import LargeRecipeCard from '../../components/recipe-cards/LargeRecipeCard';


export default function Trending({trendingRecipes, popularTags, userStats }) {
    const navigate = useNavigate();
    const goToLogin = useLoginRedirect();

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
                            <LargeRecipeCard recipe={recipe} userStats={userStats} />
                        ))}
                    </div>
                </section>
            )}
        </>
    )
}