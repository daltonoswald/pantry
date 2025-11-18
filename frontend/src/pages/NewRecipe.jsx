import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Trash } from 'react-bootstrap-icons';
import deleteIcon from '../assets/icons/delete.svg'

export default function NewRecipe() {
    const navigate = useNavigate();
    const [ingredientList, setIngredientList] = useState([{ingredient: '', ingredientNote: '', unitAmount: '', unit: ''}])
    const [message, setMessage] = useState();
    const token = localStorage.getItem('pantryAuthToken');

    const cookingUnits = [
        "tsp", "tbsp", "fl oz", "cup", "pt", "qt", "gal", "ml", "l",
        "oz", "lb", "g", "kg"
      ]

    const handleUnitAmountChange = (e, index) => {
        const {name, value} = e.target;
        const list = [...ingredientList];
        list[index][name] = value;
        setIngredientList(list);
    }

    const handleUnitChange = (e, index) => {
        const {name, value} = e.target;
        const list = [...ingredientList];
        list[index][name] = value;
        setIngredientList(list);
    }

    const handleIngredientChange = (e, index) => {
        const {name, value} = e.target;
        const list = [...ingredientList];
        list[index][name] = value;
        setIngredientList(list);
    }
    const handleIngredientNoteChange = (e, index) => {
        const {name, value} = e.target;
        const list = [...ingredientList];
        list[index][name] = value;
        setIngredientList(list);
    }

    const handleAddIngredient = () => {
        console.log('increased');
        setIngredientList([...ingredientList, {ingredient: '' }]);
    }

    const handleRemoveIngredient = (index) => {
        console.log('removed')
        const list = [...ingredientList];
        list.splice(index, 1);
        setIngredientList(list);
        console.log(ingredientList)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tagList = e.target.tags.value.split(',').map(item => item.trim());
        const recipeData = {
            title: e.target.title.value,
            description: e.target.description.value,
            servings: e.target.servings.value,
            cookTime: e.target.cookTime.value,
            ingredientList: ingredientList,
            directions: e.target.directions.value,
            tags: tagList
        }
        console.log(recipeData.ingredientList)
        const url = `http://localhost:3000/recipe/new-recipe`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(recipeData)
            })
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
            } else {
                console.error(data.message)
                // setMessage(data.message)
            }
        } catch (error) {
            console.error(`Error requesting:`, error);
            setMessage(`There was an error adding your recipe. Please try again later.`)
        }
    }

    return (
        <div className='app'>
            <Header />
            <Container className='my-auto pb-3' fluid>
                <Form className='w-75 p-3 mx-auto border border-primary-subtle rounded' onSubmit={handleSubmit}>
                    <h3 className='text-center m-2'>Create a New Recipe</h3>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formTitle' label='Title'>
                                    <Form.Control name='title' type='text' placeholder='Title' />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formDescription' label='Description'>
                                    <Form.Control name='description' type='text' placeholder='Description' style={{ height: '6em' }} />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formServings' label='Servings'>
                                    <Form.Control name='servings' type='number' placeholder='servings' min={1} defaultValue={4} />
                                </FloatingLabel>
                            </Col>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formCookTime' label='Cook time (minutes)'>
                                    <Form.Control name='cookTime' type='number' placeholder='Cook time (minutes)' min={1} defaultValue={30} />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        {ingredientList.map((ingredient, index) => (
                            <Form.Group as={Row} className='align-items-center mt-2 mb-2'>
                                <Col xs={2} className='ms-2'>
                                    <FloatingLabel controlId='formIngredientUnitAmount' label='Amount'>
                                        <Form.Control 
                                            name='unitAmount' 
                                            type='number' 
                                            placeholder='amount'
                                            onChange={(e) => handleUnitAmountChange(e, index)} 
                                            min={1} 
                                            defaultValue={0}
                                            required />
                                    </FloatingLabel>
                                </Col>
                                <Col xs={2}>
                                    <FloatingLabel controlId='formIngredientUnit' label='Unit'>
                                        <Form.Select aria-label='Unit' onChange={(e) => handleUnitChange(e, index)} name='unit'>
                                            {cookingUnits.map((unit) =>
                                                <option 
                                                    key={unit} 
                                                    name='unit'
                                                    defaultValue={'tsp'}
                                                    value={unit}
                                                    required 
                                                    >{unit}</option>
                                            )}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col xs='auto'>
                                    <FloatingLabel controlId='formIngredientNote' label='Notes (diced, etc.)'>
                                        <Form.Control 
                                            name='ingredientNote' 
                                            type='text'
                                            placeholder='Notes (diced, thin-sliced, etc.)' 
                                            value={ingredient.ingredientNote} 
                                            onChange={(e) => handleIngredientNoteChange(e, index)} 
                                            size='auto'
                                            />
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel controlId='formIngredient' label='Ingredient'>
                                        <Form.Control 
                                            name='ingredient' 
                                            type='text'
                                            placeholder='Ingredient' 
                                            value={ingredient.ingredient} 
                                            onChange={(e) => handleIngredientChange(e, index)} 
                                            size='auto'
                                            required
                                            />
                                    </FloatingLabel>
                                </Col>
                                <Col xs='auto' className='me-2'>
                                    <Button variant='danger' type='button' onClick={() => handleRemoveIngredient(index)}>
                                        <Trash color='black' />
                                    </Button>
                                </Col>
                            </Form.Group>
                        ))}
                        <Row className='justify-content-md-center'>
                            <Button className='w-25 m-2' type='button' onClick={handleAddIngredient}>Add Ingredient</Button>
                        </Row>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formDirections' label='Directions'>
                                    <Form.Control as="textarea" name='directions' type='text' placeholder='Directions' style={{ height: '16em' }} />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formTags' label='Tags (separate with commas)'>
                                <Form.Control name='tags' type='text' placeholder='Tags (separate with commas)' />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row className='justify-content-md-center'>
                            <Button className='w-50 m-2' type='submit'>Create Recipe</Button>
                        </Row>
                </Form>
                {message && (
                    <Alert className='w-25 m-3 p-3 mx-auto' variant='danger'>{message}</Alert>
                )}
            </Container>
        </div>
    )
}