import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert, Spinner, Stack } from 'react-bootstrap';
import Header from '../../components/Header';
import ErrorModal from '../../components/ErrorModal';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './recipe.styles.css';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { favoriteRecipe, unfavoriteRecipe } from '../../utils/utility';

export default function Recipe() {
    const navigate = useNavigate();
    const params = useParams();
    const token = localStorage.getItem('pantryAuthToken');
    const [isLoading, setIsLoading] = useState(true);
    const [myData, setMyData] = useState();
    const [recipeData, setRecipeData] = useState();
    const [message, setMessage] = useState(null);
    const [isAuthor, setIsAuthor] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        const getRecipe = async () => {
            const url = `http://localhost:3000/recipe/${params.recipeId}`
            const recipeToFind = {
                recipeToFind: params.recipeId,
            }
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(recipeToFind),
                    mode: 'cors',
                })
                const data = await response.json();
                if (!response.ok) {
                    const errorData = await response.json();
                    setIsLoading(false);
                    console.error(`Error Data: `, errorData.error);
                    setMessage(errorData.error.message);
                } else {
                    console.log(data);
                    setRecipeData(data.recipeData);
                    if (data.currentUser) {
                        setMyData(data.currentUser)
                        setIsAuthor(data.isAuthor)
                        setIsFavorited(data.isFavorited)
                    }
                    setMessage(null);
                }
            } catch (error) {
                console.log('catch');
                setMessage(error);
            } finally {
                setIsLoading(false)
            }
        }
        getRecipe();
    }, [params.recipe, navigate])

    const handleFavoriteRecipe = async (e) => {
        e.preventDefault();
        setMessage(null);
        const recipeId = {
            recipeId: params.recipeId
        }
        const result = await favoriteRecipe(recipeId)

        console.log(71, result)

        if (result.success) {
            // setMessage({ type: 'success', text: result.message });
            window.location.reload();
        } else {
            setMessage({ type: 'danger', text: result.message || 'Failed to favorite recipe.'})
        }
    }

    const handleUnfavoriteRecipe = async (e) => {
        e.preventDefault();
        setMessage(null);
        const recipeId = {
            recipeId: params.recipeId
        }
        const result = await unfavoriteRecipe(recipeId)

        if (result.success) {
            // setMessage({ type: 'success', text: result.message });
            window.location.reload();
        } else {
            setMessage({ type: 'danger', text: result.message || 'Failed to unfavorite recipe.'})
        }
    }

    if (isLoading) {
        return (
            <div className='app'>
                <Header />
                <Spinner />
                <p>Loading...</p>
            </div>
        )
    }
    if (!isLoading && message) {
        console.log(message)
        return (
            <div className='app'>
                <Header />
                <ErrorModal error={message} />
            </div>
        )
    }

    if (!isLoading && !message) {
        return (
            <div className='app'>
                <Header />
                <Container className='my-auto main-content' fluid>
                    <h1>{recipeData.title}</h1>
                    <h3>By <Link id={recipeData.user.username} to={`/user/${recipeData.user.username}`}>{recipeData.user.username}</Link></h3>
                    <p>{recipeData.description}</p>
                    {(isFavorited && !isAuthor) && (
                        <HeartFill color='red' onClick={handleUnfavoriteRecipe} />
                    )}
                    {(!isFavorited && !isAuthor) && (
                        <Heart onClick={handleFavoriteRecipe} />
                    )}
                    <Stack gap={3} className='ingredient-list p-4'>
                        <h4 className='text-center'>Ingredients</h4>
                        {recipeData.ingredients.map((item) => (
                            <p key={item.id}>
                                {item.quantity} {item.measurement} <Link to={`/search?q=${item.ingredient.name}&t=all`}>{item.ingredient.name}</Link> {item.preparationNotes}
                            </p>
                        ))}
                    </Stack>
                    <Stack gap={3} className='p-4'>
                        <h4 className='text-center'>Directions</h4>
                        {recipeData.steps.map((step) => (
                            <Row key={step.id}>
                                <Col xs='auto'><strong>{step.order}</strong></Col>
                                <Col><p>{step.step}</p></Col>
                            </Row>
                        ))}
                    </Stack>
                    <Col className='d-flex flex-row gap-2'>
                        {recipeData.recipeTags.map((tag) => (
                            <Link key={tag.id} to={`/search?q=${tag.tag.name}&t=all`}>{tag.tag.name}</Link>
                        ))}
                    </Col>
                </Container>
            </div>
        )
    }
}