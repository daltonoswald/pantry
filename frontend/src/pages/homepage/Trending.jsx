import { useNavigate, Link } from 'react-router-dom';
import { Clock, GraphUp, Heart, HeartFill,  Stopwatch } from 'react-bootstrap-icons';
import { Badge, Button, Col, Card, Row } from 'react-bootstrap';
import { favoriteRecipe, unfavoriteRecipe, toggleFavoriteRecipe} from '../../utils/utility';
import kitchenImg from '../../assets/temp-stock-photos/kitchen.jpg'
import './homepage.css'


export default function Trending({trendingRecipes, popularTags, userStats, favoriteStatus }) {

    console.log(trendingRecipes);

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

    return (
        <>
            {trendingRecipes.length > 0 && (
                <section className='mb-5 trending-container'>
                    <div className='d-flex justify-content-between align-items center mb-3'>
                        <h2 className='d-flex align-items-center'><GraphUp className='m-2' />Trending Recipes</h2>
                    </div>
                    <Row>
                        {trendingRecipes.slice(0, 3).map(recipe => (
                            <Col md={4} key={recipe.id}>
                                <div className='trending-recipe-card'>
                                    <div className='trending-recipe-image-container'>
                                        <Link to={`/recipe/${recipe.id}`}> 
                                            <img src={recipe.image || kitchenImg} className='trending-recipe-image' alt='recipe image' />
                                        </Link>
                                    </div>
                                    <div className='trending-recipe-about'>
                                        <p>From <Link to={`/user/${recipe.user.username}`}>{recipe.user.name}</Link></p>
                                        <div className='trending-recipe-time'>
                                            <Clock />
                                            <p>{recipe.cookTime} mins</p>
                                        </div>
                                        <h3 className='trending-recipe-title'>
                                            <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
                                        </h3>
                                        <p>{recipe.description}</p>
                                        <div className='trending-recipe-tags'>
                                            {recipe.recipeTags.map(tag => (
                                                <Link className='trending-recipe-tag' to={`search?q=${tag.tag.name}&t=tags`} key={tag.tag.name}>{tag.tag.name}</Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </section>
            )}
        </>
    )
}