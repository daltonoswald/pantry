import Header from '../../components/header/Header';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GoPlusCircle } from 'react-icons/go';
import { MdClose } from 'react-icons/md';
import TinyEditor from '../../components/tinyEditor/TinyEditor';
import ImageUpload from '../../components/ImageUpload';
import Alert from '../../components/modals/Alert';
import './newRecipe.css'

export default function NewRecipe() {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState(null);
    const [ingredientList, setIngredientList] = useState([{ingredient: '', ingredientNote: '', unitAmount: '', unit: ''}]);
    const [steps, setSteps] = useState(['']);
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

    const handleStepChange = (e, index) => {
        const list = [...steps];
        list[index] = e.target.value;
        setSteps(list);
    }

    const handleAddStep = () => setSteps([...steps, '']);

    const handleRemoveStep = (index) => {
        const list = [...steps];
        list.splice(index, 1);
        setSteps(list);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('file,', imageUrl)
        const tagList = e.target.tags.value.split(',').map(item => item.trim());
        console.log(e.target.title.value);
        const recipeData = {
            title: e.target.title.value,
            description: e.target.description.value,
            imageUrl: imageUrl,
            servings: e.target.servings.value,
            cookTime: e.target.cookTime.value,
            ingredientList: ingredientList,
            steps: steps,
            tags: tagList
        }
        console.log(recipeData);
        const url = `http://localhost:3000/recipe/new-recipe`;
        try {
            console.log(recipeData.imageUrl);
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
                navigate(`/recipe/${data.recipe.id}`)
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
            <div className='new-recipe-container'>
                <form className='new-recipe-form' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <ImageUpload onUpload={(url) => {
                            console.log('Setting imageUrl: ', url)
                            setImageUrl(url)}
                        } />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='title' className='form-label'>Recipe Title</label>
                        <input 
                            type='text'
                            id='title'
                            name='title'
                            placeholder='e.g. Sourdough Pizza'
                            className='form-input'
                            required />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='description' className='form-label'>Description</label>
                        <input 
                            type='text'
                            id='description'
                            name='description'
                            placeholder='Share a quick description of your creation'
                            className='form-input'
                            required />
                    </div>
                    <div className='new-recipe-block-container'>
                        <div className='new-recipe-block'>
                            <label htmlFor='cookTime' className='form-block-label'>Cook (mins)</label>
                            <input 
                                type='number'
                                id='cookTime'
                                name='cookTime'
                                defaultValue={25}
                                className='form-block-input'
                                required />
                        </div>
                        <div className='new-recipe-block'>
                            <label htmlFor='servings' className='form-block-label'>Servings</label>
                            <input 
                                type='number'
                                id='servings'
                                name='servings'
                                defaultValue={4}
                                className='form-block-input'
                                required />
                        </div>
                    </div>
                    <div className='form-ingredient-container'>
                        <div className='form-ingredient-title-container'>
                            <h2 className='form-title'>Ingredients</h2>
                            <p className='add-ingredient' onClick={handleAddIngredient}><GoPlusCircle /> Add Ingredient</p>
                        </div>
                        <div className='form-group-ingredient-container'>
                            {ingredientList.map((ingredient, index) => (
                                <div className='form-group-ingredient'>
                                    <input
                                        type='number'
                                        name='unitAmount'
                                        id='unitAmount'
                                        className='form-input'
                                        step='0.25'
                                        onChange={(e) => handleUnitAmountChange(e, index)}
                                        min={0}
                                        defaultValue={0}
                                        required />
                                    <select onChange={(e) => handleUnitChange(e, index)} name='unit' className='form-input' required>
                                        {cookingUnits.map((unit) => 
                                            <option
                                                key={unit}
                                                name='unit'
                                                defaultValue={'tsp'}
                                                value={unit}
                                                required
                                                >{unit}</option>
                                        )}
                                    </select>
                                    <input
                                        type='text'
                                        name='ingredientNote'
                                        id='ingredientNote'
                                        className='form-input'
                                        onChange={(e) => handleIngredientNoteChange(e, index)}
                                        placeholder='Notes (diced, thin-sliced, etc.)'
                                        required />
                                    <input
                                        type='text'
                                        name='ingredient'
                                        id='ingredient'
                                        className='form-input form-ingredient-input'
                                        onChange={(e) => handleIngredientChange(e, index)}
                                        placeholder='Ingredient name...'
                                        required />
                                    {/* <p onClick={() => handleRemoveIngredient(index)}>&times;</p> */}
                                    <MdClose onClick={() => handleRemoveIngredient(index)} className='form-ingredient-delete' />
                                </div>
                            ))}
                        </div>
                        </div>
                    <div className='form-method-container'>
                        <div className='form-method-title-container'>
                            <h2 className='form-title'>Method</h2>
                            <p className='add-ingredient' onClick={handleAddStep}><GoPlusCircle /> Add Step</p>
                        </div>
                        <div className='form-group-step-container'>
                            {steps.map((step, index) => (
                                <div className='form-group-step'>
                                    <p className='recipe-step-counter'>{index + 1}</p>
                                    <input
                                        type='textarea'
                                        rows={2}
                                        value={step}
                                        className='form-input'
                                        onChange={(e) => handleStepChange(e, index)}
                                        placeholder={`Step ${index + 1}`}
                                        required />
                                    <MdClose onClick={() => handleRemoveStep(index)} className='form-step-delete' />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='tags' className='form-label'>Tags (seperate with commas)</label>
                        <input 
                            type='text'
                            id='tags'
                            name='tags'
                            placeholder='breakfast, lunch, dinner'
                            className='form-input'
                            required />
                    </div>
                    {message && (
                        <Alert message={message} />
                    )}
                </form>
            </div>
        </div>
    )
}