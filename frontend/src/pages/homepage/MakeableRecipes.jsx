import { Link } from 'react-router-dom';
import { MdArrowRightAlt } from 'react-icons/md'
import SmallRecipeCard from '../../components/recipe-cards/SmallRecipeCard';
import { useAuth } from '../../context/AuthContext';

export default function MakeableRecipes({ makeableRecipes, recipesByPantry }) {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) return (
        <div className='homepage-auth-container'>
            <div className='homepage-auth-container-tl'></div>
            <div className='homepage-auth-container-br'></div>
            <h3>Want to find recipes you can make today?</h3>
            <p><Link to='/sign-up'>Sign up</Link> or <Link to='login'>Log in</Link> and create your pantry.</p>
            <p>Join today and add ingredients to your pantry to find personalized recipes that you can make. Expand your palate and discover new flavors.</p>
        </div>
    )

    if (isLoggedIn) return (
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
                            <SmallRecipeCard recipe={recipe} />
                        ))}
                    </div>
                </section>
            )}
            
            {recipesByPantry.length > 0 && (
                <section className='by-pantry-container'>
                    <div className='homepage-title-container'>
                        <h2>Almost Ready</h2>
                        <div className='homepage-subtitle'>
                            <p>A quick stop at the store for even more meals.</p>
                            <Link to='/recipes/all-by-pantry'>View All<MdArrowRightAlt /></Link>
                        </div>
                    </div>
                    <div className='makeable-recipe-card-container'>
                        {recipesByPantry.map(recipe => (
                            <SmallRecipeCard recipe={recipe} />
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