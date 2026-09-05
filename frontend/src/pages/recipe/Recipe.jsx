import Header from '../../components/header/Header';
import ErrorModal from '../../components/ErrorModal';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import kitchenImg from '../../assets/temp-stock-photos/kitchen.jpg'
import { GoHeart, GoHeartFill, GoShareAndroid } from 'react-icons/go'
import { toggleFavoriteRecipe } from '../../utils/utility';
import './recipe.styles.css';

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

    const handleToggleFavoriteRecipe = async (recipeId) => {

        console.log('toggling: ', recipeId)
        const result = await toggleFavoriteRecipe(recipeId)

        if (result.success) {
            // setMessage({ type: 'success', text: result.message });
            window.location.reload();
        } else {
            // setMessage({ type: 'danger', text: result.message || 'Failed to favorite recipe.'})
        }
    }

    const handleCompleteStep = (e) => {
        e.currentTarget.classList.toggle('step-completed');
    }

    if (isLoading) {
        return (
            <div className='app'>
                <Header />
                <div className='spinner-container'>
                    <div className='loading-spinner'></div>
                </div>
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
                <div className='recipe-page'>
                    <div className='recipe-image-container'>
                        <img 
                            src={ recipeData.image || kitchenImg }
                            alt='recipe image'
                            className='recipe-background-image'
                        />
                        <div className='recipe-text-overlay'>
                            <h2>{recipeData.title}</h2>
                            <p>{recipeData.description}</p>
                        </div>
                    </div>
                    <div className='recipe-info-bar'>
                        <div className='recipe-info-left'>
                            <div className='recipe-info-col'>
                                <div className='recipe-cook-time'>
                                    <p className='recipe-info-label'>COOK TIME</p>
                                    <p className='recipe-info-data'>{recipeData.cookTime} mins</p>
                                </div>
                            </div>
                            <div className='recipe-info-col'>
                                <div className='recipe-servings'>
                                    <p className='recipe-info-label'>SERVINGS</p>
                                    {recipeData.servings > 1 && (
                                        <p className='recipe-info-data'>{recipeData.servings} portions</p>
                                    )}
                                    {recipeData.servings === 1 && (
                                        <p className='recipe-info-data'>{recipeData.servings} portion</p>
                                    )}
                                </div>
                            </div>
                            <div className='recipe-info-col'>
                                <div className='recipe-date'>
                                    <p className='recipe-info-label'>POSTED</p>
                                    <p className='recipe-info-data'>{format(recipeData.createdAt, 'MMMM dd, yyyy')}</p>
                                </div>
                            </div>
                            {(recipeData.createdAt !== recipeData.updatedAt) && (
                                <div className='recipe-info-col'>
                                    <div className='recipe-date'>
                                        <p className='recipe-info-label'>LAST UPDATED</p>
                                        <p className='recipe-info-data'>{format(recipeData.createdAt, 'MMMM dd, yyyy')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='recipe-info-right'>
                            {(!isAuthor) && (
                                <div className='recipe-info-containers'>
                                    <div className='recipe-info-favorite'>
                                        {(isFavorited && myData && !isAuthor) && (
                                            <GoHeartFill className='favorited icon-link' onClick={() => handleToggleFavoriteRecipe(params.recipeId)} />
                                        )}
                                        {(!isFavorited && myData && !isAuthor) && (
                                            <GoHeart className='not-favorited icon-link' onClick={() => handleToggleFavoriteRecipe(params.recipeId)} />
                                        )}
                                        {(!myData && (
                                            <GoHeart className='not-favorited icon-link' onClick={() => navigate('/login')} />
                                        ))}
                                    </div>
                                    <p>{recipeData._count.favorites}</p>
                                </div>
                            )}
                            <div className='recipe-info-share'>
                                <GoShareAndroid className='share-icon icon-link' color='black' onClick={() => navigator.clipboard.writeText(window.location.href)} />
                            </div>
                        </div>
                    </div>
                    <div className='recipe-instructions'>
                        <div className='recipe-ingredients'>
                            <h2 className='recipe-ingredients-title'>Ingredients</h2>
                            <div className='recipe-ingredient-list'>
                                {recipeData.ingredients.map((item) => (
                                    <label className='recipe-ingredient' key={item.id}>
                                        <input type='checkbox' />
                                        <span>
                                            {item.quantity} {item.measurement} <Link to={`/search?q=${item.ingredient.name}&t=all`}>{item.ingredient.name}</Link>
                                            {(item.preparationNotes !== "") && (
                                                <span>, {item.preparationNotes}</span>
                                            )}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className='recipe-directions'>
                            <h2 className='recipe-directions-title'>Directions</h2>
                            <div className='recipe-direction-list'>
                                {recipeData.steps.map((step) => (
                                    <div className='recipe-step' key={step.id}>
                                        <h3 className='recipe-step-index' onClick={handleCompleteStep}>{step.order}</h3>
                                        <p>{step.step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='recipe-tags tag-container'>
                        {recipeData.recipeTags.map((tag) => (
                            <Link className='recipe-tag' key={tag.id} to={`/search?q=${tag.tag.name}&t=all`}>{tag.tag.name}</Link>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}