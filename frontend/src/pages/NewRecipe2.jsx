import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Trash, PlusCircle } from 'react-bootstrap-icons';
import TinyEditor from '../components/tinyEditor/TinyEditor';

export default function NewRecipe2() {
    const navigate = useNavigate();
    const [ingredientList, setIngredientList] = useState([{ingredient: '', ingredientNote: '', unitAmount: '', unit: ''}]);
    const [directions, setDirections] = useState('');
    const [message, setMessage] = useState();
    const token = localStorage.getItem('pantryAuthToken');

    const cookingUnits = [
        "tsp", "tbsp", "fl oz", "cup", "pt", "qt", "gal", "ml", "l",
        "oz", "lb", "g", "kg", "count"
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
        console.log(e.target.title.value);
        const recipeData = {
            title: e.target.title.value,
            description: e.target.description.value,
            servings: e.target.servings.value,
            cookTime: e.target.cookTime.value,
            ingredientList: ingredientList,
            // directions: e.target.directions.value,
            directions: directions,
            tags: tagList
        }
        console.log(recipeData);
        const url = `http://localhost:3000/recipe/new-recipe`;
        // try {
        //     // console.log(directions);
        //     // console.log(recipeData.description);
        //     const response = await fetch(url, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             Authorization: `Bearer ${token}`
        //         },
        //         body: JSON.stringify(recipeData)
        //     })
        //     const data = await response.json();
        //     if (response.ok) {
        //         console.log(data.message);
        //         navigate(`/recipe/${data.recipe.id}`)
        //     } else {
        //         console.error(data.message)
        //         // setMessage(data.message)
        //     }
        // } catch (error) {
        //     console.error(`Error requesting:`, error);
        //     setMessage(`There was an error adding your recipe. Please try again later.`)
        // }
    }

    return (
        <div className='app'>
            <Header />
            <Container className='my-auto pb-3' fluid>
                <Form className='w-75 p-3 mx-auto border border-primary-subtle rounded' onSubmit={handleSubmit}>
                        <Form.Group className='m-2' controlId='title'>
                            <Form.Label>RECIPE TITLE</Form.Label>
                            <Form.Control placeholder='e.g. Sourdough Pizza' />
                        </Form.Group>
                        <Form.Group className='m-2' controlId='description'>
                            <Form.Label>DESCRIPTION</Form.Label>
                            <Form.Control placeholder='Share a quick description of your creation' />
                        </Form.Group>
                        <Row className='m-2 g-0 justify-content-around'>
                            <Form.Group as={Col} md={4} controlId='cookTime'>
                                <Form.Label>COOK TIME</Form.Label>
                                <Form.Control />
                            </Form.Group>
                            <Form.Group as={Col} md={4} controlId='servings'>
                                <Form.Label>SERVINGS</Form.Label>
                                <Form.Control />
                            </Form.Group>
                        </Row>
                        <Row className='m-2 g-0 justify-content-end align-items-center'>
                            <Col as='h2'>Ingredients</Col>
                            {/* <Button as={Col} md={2} className='w-25 m-2 pantry-secondary' type='button' onClick={handleAddIngredient}>Add Ingredient</Button> */}
                            <Col as='p' md={1} className='d-flex justify-content-around align-items-center text-end w-auto' onClick={handleAddIngredient}><PlusCircle className='me-2' /> Add</Col>
                        </Row>
                        
                        {ingredientList.map((ingredient, index) => (
                            <Form.Group as={Row} className='align-items-center mt-2 mb-2'>
                                <Form.Group as={Col}  className='ms-2 w-auto' controlId='ingredientUnitAmount'>
                                    <Form.Control 
                                        placeholder='Qty' 
                                        name='unitAmount' 
                                        type='number' 
                                        step='0.25' 
                                        onChange={(e) => handleUnitAmountChange(e, index)}
                                        min={0}
                                        defaultValue={0}
                                        required />
                                </Form.Group>
                                <Form.Group as={Col} xs={2} className='ms-2 w-auto' controlId='ingredientIngredientUnit'>
                                    <Form.Select aria-label='Unit' onChange={(e) => handleUnitChange(e, index)} name='unit' required >
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
                                </Form.Group>
                                <Form.Group as={Col} xs={3} className='ms-2 flex-grow-1' controlId='formIngredientNote'>
                                    <Form.Control 
                                        name='ingredientNote'
                                        type='text'
                                        placeholder='Notes (diced, thin-sliced, etc.)' 
                                        value={ingredient.ingredientNote} 
                                        onChange={(e) => handleIngredientNoteChange(e, index)} 
                                        size='auto' 
                                        />
                                </Form.Group>
                                <Form.Group as={Col} xs='auto' className='ms-2 flex-grow-1' controlId='formIngredient'>
                                    <Form.Control 
                                        name='ingredient' 
                                        type='text'
                                        placeholder='Ingredient name...' 
                                        value={ingredient.ingredient} 
                                        onChange={(e) => handleIngredientChange(e, index)} 
                                        size='auto'
                                        required
                                        />
                                </Form.Group>
                                <Col xs={1} className='me-2 w-auto'>
                                    <Button variant='danger' type='button' onClick={() => handleRemoveIngredient(index)}>
                                        <Trash color='black' />
                                    </Button>
                                </Col>
                            </Form.Group>
                        ))}
                        <Row>
                            <Col className='m-2'>
                                {/* <FloatingLabel controlId='formDirections' label='Directions' >
                                    <Form.Control as="textarea" name='directions' type='text' placeholder='Directions' style={{ height: '16em' }} />
                                </FloatingLabel> */}
                                <TinyEditor value={directions} onChange={setDirections} />
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
                            <Button className='w-50 m-2 pantry-secondary' type='submit'>Create Recipe</Button>
                        </Row>
                </Form>
                {message && (
                    <Alert className='w-25 m-3 p-3 mx-auto' variant='danger'>{message}</Alert>
                )}
            </Container>
        </div>
    )
}