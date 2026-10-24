import { useNavigate, Link } from 'react-router-dom';
import { GoClock, GoHeart, GoHeartFill } from 'react-icons/go'
import { favoriteRecipe, unfavoriteRecipe, toggleFavoriteRecipe } from '../../utils/utility';
import kitchenImg from '../../assets/temp-stock-photos/kitchen.jpg'
import './homepage.css'
import useLoginRedirect from '../../utils/useLoginRedirect';
import LargeRecipeCard from '../../components/recipe-cards/LargeRecipeCard';


export default function Trending({trendingRecipes, popularTags }) {

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
                            <LargeRecipeCard recipe={recipe} />
                        ))}
                    </div>
                </section>
            )}
        </>
    )
}