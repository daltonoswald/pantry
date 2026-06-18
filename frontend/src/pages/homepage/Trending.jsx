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
                                {/* <Card className='mb-3 h-100'>
                                    <Card.Body style={{cursor: 'pointer'}} >
                                        <Card.Title>
                                            <Row>
                                                <Col xs={6}>
                                                    <Link className='stretched-link' to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
                                                </Col>
                                                <Col xs={6}>
                                                    <Row>
                                                        <p className='d-flex align-items-center justify-content-end text-end mb-0'>
                                                            {(userStats != null && favoriteStatus[recipe.id] && recipe.user.id !== userStats.id) ? (
                                                                <HeartFill className='secondary-link' color='red' onClick={() => handleToggleFavoriteRecipe(recipe.id)} />
                                                            ) : (userStats != null && !favoriteStatus[recipe.id] && recipe.user.id !== userStats.id) ? (
                                                                <Heart className='secondary-link' onClick={() => handleToggleFavoriteRecipe(recipe.id)} />
                                                            ) : (
                                                                <Heart className='secondary-link' onClick={() => handleToggleFavoriteRecipe(recipe.id)} />   
                                                            )
                                                            }
                                                        </p>
                                                    </Row>
                                                    <Row>
                                                        <p className='d-flex align-items-center justify-content-end text-end mb-0'><Stopwatch className='me-2' />{recipe.cookTime}</p>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Card.Title>
                                        <Card.Subtitle>
                                            <Link className='secondary-link' to={`/user/${recipe.user.username}`}>
                                                By {recipe.user.name}
                                            </Link>
                                        </Card.Subtitle>
                                        <Card.Text className='text-muted small'>
                                            {recipe.description}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer className='text-muted d-flex flex-row gap-2'>
                                        {recipe.recipeTags.map(tag => (
                                            <Link className='text-muted secondary-link' to={`search?q=${tag.tag.name}&t=tags`} key={tag.tag.name}>{tag.tag.name}</Link>
                                        ))}
                                    </Card.Footer>
                                </Card> */}
                                <div className='trending-recipe-card'>
                                    <div className='trending-recipe-image-container'>
                                        <img src={recipe.image || kitchenImg} className='trending-recipe-image' alt='recipe image' />
                                    </div>
                                    <div className='trending-recipe-about'>
                                        <p>From <Link to={`/user/${recipe.user.username}`}>{recipe.user.name}</Link></p>
                                        <div className='trending-recipe-time'>
                                            <Clock />
                                            <p>{recipe.cookTime} mins</p>
                                        </div>
                                        <h3 className='trending-recipe-title'>{recipe.title}</h3>
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