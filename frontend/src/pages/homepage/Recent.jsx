import { useNavigate, Link } from 'react-router-dom';
import { ClockHistory, Stopwatch } from 'react-bootstrap-icons';
import { Badge, Button, Col, Card, Row } from 'react-bootstrap';


export default function Recent({ recentRecipes }) {
    const navigate = useNavigate();

    return (
        <>
            {recentRecipes.length > 0 && (
                <section className='mb-5'>
                    <div className='d-flex justify-content-between align-items center mb-3'>
                        <h2><ClockHistory className='m-2' />Recent Recipes</h2>
                        {/* <Link to='/recipes/by-pantry'>
                            <Button variant='outline-primary'>See All</Button>
                        </Link> */}
                    </div>
                    <Row>
                        {recentRecipes.slice(0, 3).map(recipe => (
                            <Col md={4} key={recipe.id}>
                                <Card className='mb-3 h-100'>
                                    <Card.Body onClick={() => navigate(`/recipe/${recipe.id}`)} style={{cursor: 'pointer'}} >
                                        <Card.Title>
                                            <Row>
                                                <Col xs={6}>{recipe.title}</Col>
                                                <Col xs={6} className='text-end mb-0'><Stopwatch className='me-2' />{recipe.cookTime}</Col>
                                            </Row>
                                        </Card.Title>
                                        <Card.Subtitle>
                                            <Link to={`/user/${recipe.user.username}`}>
                                                By {recipe.user.name}
                                            </Link>
                                        </Card.Subtitle>
                                        <Card.Text className='text-muted small'>
                                            {recipe.description}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer className='text-muted d-flex flex-row gap-2'>
                                        {recipe.recipeTags.map(tag => (
                                            <p>{tag.tag.name}</p>
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