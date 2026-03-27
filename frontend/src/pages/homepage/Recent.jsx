import { useNavigate, Link } from 'react-router-dom';
import { ClockHistory, Stopwatch } from 'react-bootstrap-icons';
import { Badge, Button, Col, Card, Row } from 'react-bootstrap';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { favoriteRecipe, unfavoriteRecipe, toggleFavoriteRecipe } from '../../utils/utility';


export default function Recent({ recentRecipes, userStats, favoriteStatus }) {

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
            {recentRecipes.length > 0 && (
                <section className='mb-5'>
                    <div className='d-flex justify-content-between align-items center mb-3'>
                        <h2 className='d-flex align-items-center justify-content-end'><ClockHistory className='m-2' />Recent Recipes</h2>
                        {/* <Link to='/recipes/by-pantry'>
                            <Button variant='outline-primary'>See All</Button>
                        </Link> */}
                    </div>
                    <Row>
                        {recentRecipes.slice(0, 3).map(recipe => (
                            <Col md={4} key={recipe.id}>
                                <Card className='mb-3 h-100'>
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
                                                                <>
                                                                 <Heart className='secondary-link' onClick={() => handleToggleFavoriteRecipe(recipe.id)} />   
                                                                    
                                                                </>
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
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>
            )}
        </>
    )
}