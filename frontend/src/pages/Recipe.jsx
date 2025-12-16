import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert, Spinner, Stack } from 'react-bootstrap';
import Header from '../components/Header';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Recipe() {
    const navigate = useNavigate();
    const params = useParams();
    const token = localStorage.getItem('pantryAuthToken');
    const [isLoading, setIsLoading] = useState(true);
    const [myData, setMyData] = useState();
    const [recipeData, setRecipeData] = useState();
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const getRecipe = async () => {
            const url = `http://localhost:3000/recipe/${params.recipeId}`
            const recipeToFind = {
                recipeToFind: params.recipeId
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
                if (!response.ok) {
                    const errorData = await response.json();
                    setIsLoading(false);
                    console.error(`Error Data: `, errorData.error);
                    console.log('Error Message: ', errorData.error.message)
                    setMessage(errorData.error.message);
                } else {
                    const recipeData = await response.json();
                    console.log(recipeData.recipeData);
                    console.log(recipeData.recipeData.directions);
                    setRecipeData(recipeData.recipeData);
                    setMyData(recipeData.user.user)
                    setMessage(null);
                    setIsLoading(false)
                }
            } catch (error) {
                // console.error(`Errors: ${error.error.message}`);
                console.log('catch');
                setMessage(error);
            }
        }
        getRecipe();
    }, [params.recipe, navigate])

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
                <Container className='my-auto' fluid>
                    <h1>{recipeData.title}</h1>
                    <h3>A recipe by {recipeData.user.username}</h3>
                    <p>{recipeData.description}</p>
                    <Stack gap={3}>
                        <h4>Ingredients</h4>
                        {recipeData.ingredients.map((item) => (
                            <p>{item.quantity} {item.measurement} {item.ingredient.name}</p>
                        ))}
                    </Stack>
                    <div dangerouslySetInnerHTML={{ __html: recipeData.directions}} />
                </Container>
            </div>
        )
    }
}