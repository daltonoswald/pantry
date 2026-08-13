import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Badge, Button, Col, Card, Row } from 'react-bootstrap';
import { Clipboard, Clipboard2Check, Heart, HeartFill, Stopwatch } from 'react-bootstrap-icons';
import kitchenImg from '../../assets/temp-stock-photos/kitchen.jpg'
import { favoriteRecipe, toggleFavoriteRecipe, unfavoriteRecipe } from '../../utils/utility';
import { GoHeartFill, GoHeart, GoClock } from 'react-icons/go';

export default function MakeableRecipes({ makeableRecipes, recipesByPantry, userStats }) {
    const navigate = useNavigate();

    console.log('m', makeableRecipes)

    // const handleFavoriteRecipe = async (id) => {
    //     // setMessage(null);
    //     const recipeId = { 
    //         recipeId: id
    //      }
    //     console.log('favoriting: ', recipeId)
    //     const result = await favoriteRecipe(recipeId)

    //     if (result.success) {
    //         // setMessage({ type: 'success', text: result.message });
    //         window.location.reload();
    //     } else {
    //         // setMessage({ type: 'danger', text: result.message || 'Failed to favorite recipe.'})
    //     }
    // }

    // const handleUnfavoriteRecipe = async (id) => {
    //     // setMessage(null);
    //     const recipeId = { 
    //         recipeId: id
    //      }
    //     const result = await unfavoriteRecipe(recipeId)

    //     if (result.success) {
    //         // setMessage({ type: 'success', text: result.message });
    //         window.location.reload();
    //     } else {
    //         // setMessage({ type: 'danger', text: result.message || 'Failed to unfavorite recipe.'})
    //     }
    // }
    
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
            {makeableRecipes.length > 0 && (
                // <section className='mb-5'>
                //     <div className='d-flex justify-content-between align-items center mb-3'>
                //         <h2 className='d-flex align-items-center justify-content-end'><Clipboard2Check className='m-2'/>Makeable Recipes</h2>
                //     </div>
                //     <Row>
                //         {makeableRecipes.slice(0, 3).map(recipe => (
                //             <Col md={4} key={recipe.id}>
                //                 <Card className='mb-3 h-100'>
                //                     <Card.Body style={{cursor: 'pointer'}} >
                //                         <Card.Title>
                //                         <Row>
                //                             <Col xs={6}>
                //                                 <Link className='stretched-link' to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
                //                             </Col>
                //                                 <Col xs={6}>
                //                                     <Row>
                //                                         <p className='d-flex align-items-center justify-content-end text-end mb-0'>
                //                                             {(favoriteStatus[recipe.id] && recipe.user.id !== userStats.id) ? (
                //                                                 <HeartFill className='secondary-link' color='red' onClick={() => handleToggleFavoriteRecipe(recipe.id)} />
                //                                             ) : (!favoriteStatus[recipe.id] && recipe.user.id !== userStats.id) ? (
                //                                                 <Heart className='secondary-link' onClick={() => handleToggleFavoriteRecipe(recipe.id)} />
                //                                             ) : (
                //                                                 <></>
                //                                             )
                //                                             }
                //                                         </p>
                //                                     </Row>
                //                                     <Row>
                //                                         <p className='d-flex align-items-center justify-content-end text-end mb-0'><Stopwatch className='me-2' />{recipe.cookTime}</p>
                //                                     </Row>
                //                                     <Row>
                //                                         <p className='text-end mb-0 fs-6'>{recipe.matchPercentage}% Match</p>
                //                                     </Row>
                //                                 </Col>
                //                             </Row>
                //                         </Card.Title>
                //                         <Card.Subtitle>
                //                             <Link className='secondary-link' to={`/user/${recipe.user.username}`}>
                //                                 By {recipe.user.name}
                //                             </Link>
                //                         </Card.Subtitle>
                //                         <Card.Text className='text-muted small'>
                //                             {recipe.description}
                //                         </Card.Text>
                //                         <Card.Text className='text-muted small'>
                //                             {recipe.matchPercentage}% Match
                //                         </Card.Text>
                //                     </Card.Body>
                //                     <Card.Footer className='text-muted d-flex flex-row gap-2'>
                //                         {recipe.tags.map(tag => (
                //                             <Link className='text-muted secondary-link' to={`search?q=${tag.name}&t=tags`} key={tag.name}>{tag.name}</Link>
                //                         ))}
                //                     </Card.Footer>
                //                 </Card>
                //             </Col>
                //         ))}
                //         {makeableRecipes.length < 5 && (
                //             <Col  md={4}>
                //                 <Card className='mb-3 h-100' bg='warning'>
                //                     <Card.Body>
                //                         <Card.Text>Check back later or add more items to your pantry to see more makeable recipes!</Card.Text>
                //                     </Card.Body>
                //                 </Card>
                //             </Col>
                //         )}
                //     </Row>
                // </section>
                <section className='makeable-container'>
                    <div className='homepage-title-container'>
                        <h2>Within Your Pantry</h2>
                        <p className='homepage-subtitle'>Meals you can make today.</p>
                    </div>
                    <div className='makeable-recipe-card-container'>
                        {makeableRecipes.map(recipe => (
                            <div className='makeable-recipe-card'>
                                <div className='makeable-recipe-image-container'>
                                    <Link to={`/recipe/${recipe.id}`}>
                                        <img src={recipe.image || kitchenImg} className='makeable-recipe-image' alt='recipe image' />
                                    </Link>
                                </div>
                                <div className='makeable-recipe-about'>
                                    <div className='makeable-recipe-stats'>
                                        <p>From <Link to={`/user/${recipe.user.username}`}>{recipe.user.username}</Link></p>
                                        <div className='makeable-recipe-counts'>
                                            <div className='makeable-recipe-match-percentage'>
                                                {recipe.matchPercentage}% Match
                                            </div>
                                            <div className='makeable-recipe-favorites'>
                                                {(recipe.isFavorited && userStats) && (
                                                    <GoHeartFill className='favorited' onClick={() => handleToggleFavoriteRecipe(recipe.id)} />
                                                )}
                                                {(!recipe.isFavorited && userStats) && (
                                                    <GoHeart className='not-favorited' onClick={() => handleToggleFavoriteRecipe(recipe.id)} />
                                                )}
                                                {(!recipe.isFavorited && !userStats) && (
                                                    <GoHeart className='not-favorited' onClick={() => navigate('/log-in')} />
                                                )}
                                                <p>{recipe._count.favorites}</p>
                                            </div>
                                            <div className='makeable-recipe-time'>
                                                <GoClock />
                                                <p>{recipe.cookTime} mins</p>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className='makeable-recipe-title'>
                                        <Link to={`/recipe/${recipe.id}`} className='makeable-recipe-title-link'>{recipe.title}</Link>
                                    </h3>
                                    <p>{recipe.description}</p>
                                    <div className='makeable-recipe-tags'>
                                        {recipe.recipeTags.map(tag => (
                                            <Link className='makeable-recipe-tag' to={`search?q=${tag.name}&t=tags`} key={tag.name}>{tag.name}</Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
                                                            {/* {(favoriteStatus[recipe.id] && recipe.user.id !== userStats.id) ? (
                                                                <HeartFill className='secondary-link' color='red' onClick={() => handleToggleFavoriteRecipe(recipe.id)} />
                                                            ) : (!favoriteStatus[recipe.id] && recipe.user.id !== userStats.id) ? (
                                                                <Heart className='secondary-link' onClick={() => handleToggleFavoriteRecipe(recipe.id)} />
                                                            ) : (
                                                                <></>
                                                            )
                                                            } */}
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
                                        {recipe.recipeTags.map(tag => (
                                            <Link className='text-muted secondary-link' to={`search?q=${tag.name}&t=tags`} key={tag.name}>{tag.name}</Link>
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