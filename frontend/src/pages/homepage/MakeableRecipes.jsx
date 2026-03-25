import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Badge, Button, Col, Card, Row } from 'react-bootstrap';
import { Clipboard, Clipboard2Check, Heart, HeartFill, Stopwatch } from 'react-bootstrap-icons';
import { favoriteRecipe, unfavoriteRecipe } from '../../utils/utility';

export default function MakeableRecipes({ makeableRecipes, recipesByPantry, userStats, favoriteStatus }) {

    const handleFavoriteRecipe = async (id) => {
        // setMessage(null);
        const recipeId = { 
            recipeId: id
         }
        console.log('favoriting: ', recipeId)
        const result = await favoriteRecipe(recipeId)

        if (result.success) {
            // setMessage({ type: 'success', text: result.message });
            window.location.reload();
        } else {
            // setMessage({ type: 'danger', text: result.message || 'Failed to favorite recipe.'})
        }
    }

    const handleUnfavoriteRecipe = async (id) => {
        // setMessage(null);
        const recipeId = { 
            recipeId: id
         }
        const result = await unfavoriteRecipe(recipeId)

        if (result.success) {
            // setMessage({ type: 'success', text: result.message });
            window.location.reload();
        } else {
            // setMessage({ type: 'danger', text: result.message || 'Failed to unfavorite recipe.'})
        }
    }

    return (
        <>
            {makeableRecipes.length > 0 && (
                <section className='mb-5'>
                    <div className='d-flex justify-content-between align-items center mb-3'>
                        <h2 className='d-flex align-items-center justify-content-end'><Clipboard2Check className='m-2'/>Makeable Recipes</h2>
                        {/* <Link to='/recipes/by-pantry'>
                            <Button variant='outline-primary'>See All</Button>
                        </Link> */}
                    </div>
                    <Row>
                        {makeableRecipes.slice(0, 3).map(recipe => (
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
                                                            {(favoriteStatus[recipe.id] && recipe.user.id !== userStats.id) ? (
                                                                <HeartFill className='secondary-link' color='red' onClick={() => handleUnfavoriteRecipe(recipe.id)} />
                                                            ) : (!favoriteStatus[recipe.id] && recipe.user.id !== userStats.id) ? (
                                                                <Heart className='secondary-link' onClick={() => handleFavoriteRecipe(recipe.id)} />
                                                            ) : (
                                                                <></>
                                                            )
                                                            }
                                                        </p>
                                                    </Row>
                                                    <Row>
                                                        {/* <Col xs={6} className='text-end mb-0'><Stopwatch className='me-2' />{recipe.cookTime}</Col> */}
                                                        <p className='d-flex align-items-center justify-content-end text-end mb-0'><Stopwatch className='me-2' />{recipe.cookTime}</p>
                                                    </Row>
                                                    <Row>
                                                        <p className='text-end mb-0 fs-6'>{recipe.matchPercentage}% Match</p>
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
                                        <Card.Text className='text-muted small'>
                                            {recipe.matchPercentage}% Match
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer className='text-muted d-flex flex-row gap-2'>
                                        {recipe.tags.map(tag => (
                                            <p key={tag.id}>{tag.name}</p>
                                        ))}
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                        {makeableRecipes.length < 5 && (
                            <Col  md={4}>
                                <Card className='mb-3 h-100' bg='warning'>
                                    <Card.Body>
                                        <Card.Text>Check back later or add more items to your pantry to see more makeable recipes!</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </section>
            )}
            {makeableRecipes.length <= 0 && (
                <section className='mb-5'>
                    <div className='d-flex justify-content-between align-items center mb-3'>
                        <h2 className='d-flex align-items-center justify-content-end'><Clipboard2Check className='m-2' />Makeable Recipes</h2>
                        {/* <Link to='/recipes/by-pantry'>
                            <Button variant='outline-primary'>See All</Button>
                        </Link> */}
                    </div>
                    <Row>
                        <Col md={4}>
                            <Card className='mb-3 h-100' bg='warning'>
                                <Card.Body>
                                    <Card.Text>Check back later or add more items to your pantry to see more makeable recipes!</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </section>
            )}
            {recipesByPantry.length > 0 && (
                <section className='mb-5'>
                    <div className='d-flex justify-content-between align-items center mb-3'>
                        <h2 className='d-flex align-items-center justify-content-end'><Clipboard className='m-2' />Matching Your Pantry</h2>
                        {/* <Link to='/recipes/by-pantry'>
                            <Button variant='outline-primary'>See All</Button>
                        </Link> */}
                    </div>
                    <Row>
                        {recipesByPantry.slice(0, 3).map(recipe => (
                            <Col md={4} key={recipe.id}>
                                <Card className='mb-3 h-100'>
                                    <Card.Body style={{cursor: 'pointer'}} >
                                        <Card.Title>
                                            <Row>
                                                <Col xs={6}>
                                                <Link className='stretched-link' to={`/recipe/${recipe.id}`}>{recipe.title}</Link></Col>
                                                <Col xs={6}>
                                                    <Row>
                                                        <p className='d-flex align-items-center justify-content-end text-end mb-0'>
                                                            {(favoriteStatus[recipe.id] && recipe.user.id !== userStats.id) ? (
                                                                <HeartFill className='secondary-link' color='red' onClick={() => handleUnfavoriteRecipe(recipe.id)} />
                                                            ) : (!favoriteStatus[recipe.id] && recipe.user.id !== userStats.id) ? (
                                                                <Heart className='secondary-link' onClick={() => handleFavoriteRecipe(recipe.id)} />
                                                            ) : (
                                                                <></>
                                                            )
                                                            }
                                                        </p>
                                                    </Row>
                                                    <Row>
                                                        <p className='d-flex align-items-center justify-content-end text-end mb-0'><Stopwatch className='me-2' />{recipe.cookTime}</p>
                                                    </Row>
                                                    <Row>
                                                        <p className='text-end mb-0 fs-6'>{recipe.matchPercentage}% Match</p>
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
                                        {recipe.tags.map(tag => (
                                            <p key={tag.id}>{tag.name}</p>
                                        ))}
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                        {recipesByPantry.length < 5 && (
                            <Col  md={4}>
                                <Card className='mb-3 h-100' bg='warning'>
                                    <Card.Body>
                                        <Card.Text>Check back later or add more items to your pantry to see more matching recipes!</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </section>
            )}
            {recipesByPantry.length <= 0 && (
                <section className='mb-5'>
                    <div className='d-flex justify-content-between align-items center mb-3'>
                        <h2 className='d-flex align-items-center justify-content-end'><Clipboard className='m-2' />Matching Your Pantry</h2>
                        {/* <Link to='/recipes/by-pantry'>
                            <Button variant='outline-primary'>See All</Button>
                        </Link> */}
                    </div>
                    <Row>
                        <Col md={4}>
                            <Card className='mb-3 h-100' bg='warning'>
                                <Card.Body>
                                    <Card.Text>Check back later or add more items to your pantry to see more matching recipes!</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </section>
            )}
        </>
    )

}