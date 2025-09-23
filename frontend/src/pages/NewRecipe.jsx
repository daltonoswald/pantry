import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Trash } from 'react-bootstrap-icons';
import deleteIcon from '../assets/icons/delete.svg'

export default function NewRecipe() {
    const navigate = useNavigate();
    const [ingredientList, setIngredientList] = useState([{ingredient: '' }])
    const [message, setMessage] = useState();
    const token = localStorage.getItem('pantryAuthToken');

    const cookingUnits = [
        "tsp", "tbsp", "fl oz", "cup", "pt", "qt", "gal", "ml", "l",
        "oz", "lb", "g", "kg"
      ]

    const handleIngredientChange = (e, index) => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submitted')
        console.log(ingredientList);
        const tagList = e.target.tags.value.split(' ');
        console.log(tagList);

        setMessage('Error Test')
    }

    return (
        <div className='app'>
            <Header />
            <Container className='my-auto pb-3' fluid>
                <Form className='w-50 p-3 mx-auto border border-primary-subtle rounded' onSubmit={handleSubmit}>
                    <h3 className='text-center m-2'>Create a new Recipe</h3>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formTitle' label='Title'>
                                    <Form.Control name='title' type='text' placeholder='Title' />
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
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formDescription' label='A short description'>
                                    <Form.Control as="textarea" name='description' type='text' placeholder='A short description' style={{ height: '8em' }} />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        {ingredientList.map((ingredient, index) => (
                            <Form.Group as={Row} className='align-items-center mt-2 mb-2'>
                                <Col xs={2} className='ms-2'>
                                    <FloatingLabel controlId='formIngredientUnitAmount' label='Amount'>
                                        <Form.Control name='unitAmount' type='number' placeholder='amount' min={1} defaultValue={0} />
                                    </FloatingLabel>
                                </Col>
                                <Col xs={2}>
                                    <FloatingLabel controlId='formIngredientUnit' label='Unit'>
                                        <Form.Select aria-label='Unit'>
                                            {cookingUnits.map((unit) =>
                                                <option key={unit} value={unit}>{unit}</option>
                                            )}
                                        </Form.Select>
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
                                            size='lg'
                                            />
                                    </FloatingLabel>
                                </Col>
                                <Col xs={1} className='me-2'>
                                    <Button variant='danger' type='button' onClick={() => handleRemoveIngredient(index)}>
                                        <Trash color='black' />
                                    </Button>
                                </Col>
                            </Form.Group>
                        ))}
                        <Row className='justify-content-md-center'>
                            <Button className='w-25 m-2' type='button' onClick={handleAddIngredient}>Add Ingredient</Button>
                        </Row>
                        {/* <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formIngredient' label='Ingredient'>
                                    <Form.Control name='ingredient' type='text' placeholder='Ingredient' />
                                </FloatingLabel>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formDirections' label='Directions'>
                                    <Form.Control as="textarea" name='directions' type='text' placeholder='Directions' style={{ height: '16em' }} />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formTags' label='Tags (separate with spaces)'>
                                <Form.Control name='tags' type='text' placeholder='Tags (separate with spaces)' />
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