import './homepage.css'
import LargeRecipeCard from '../../components/recipe-cards/LargeRecipeCard';


export default function Trending({ trendingRecipes }) {

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
                            <LargeRecipeCard recipe={recipe} key={recipe.id} />
                        ))}
                    </div>
                </section>
            )}
        </>
    )
}