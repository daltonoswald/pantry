import { GoPlusCircle, GoArrowUpRight, GoXCircle } from 'react-icons/go';
import { Link } from 'react-router-dom';
import useLoginRedirect from '../../../utils/useLoginRedirect';
import { useState, useEffect } from 'react';
import { useToast } from '../../../components/toast/ToastContext';

export default function SearchIngredientCard({ ingredient, userStats }) {
    const goToLogin = useLoginRedirect();
    const [isAdding, setIsAdding] = useState(false);
    const [added, setAdded] = useState(!!ingredient.inPantry);
    const { showToast } = useToast();

    useEffect(() => {
        setAdded(!!ingredient.inPantry);
    }, [ingredient.inPantry])

    const handleAddToPantry = async () => {
        if (!userStats) return goToLogin();
        if (isAdding || added) return;

        const url = 'http://localhost:3000/pantry/new-item'

        setIsAdding(true);
        try {
            const token = localStorage.getItem('pantryAuthToken');
            const response = await fetch (url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ item: ingredient.name })
            });
            const data = await response.json();
            if (response.ok) {
                setAdded(true);
                showToast(data.message);
            } else {
                showToast(data.message || data.error, { type: 'error' });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsAdding(false);
        }
    }

    const handleRemoveFromPantry = async () => {
        if (!userStats) return goToLogin();
        if (isAdding) return;

        const url = 'http://localhost:3000/pantry/delete-from-pantry'

        setIsAdding(true);
        try {
            console.log('trying')
            const token = localStorage.getItem('pantryAuthToken');
            const response = await fetch (url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ item: ingredient.name })
            });
            const data = await response.json();
            console.log(data)
            if (response.ok) {
                setAdded(false);
                showToast(data.message);
            } else {
                showToast(data.message || data.error, { type: 'error' });
            }
        } catch (error) {
            console.error(error);
            showToast('Could not add to your pantry. Please try again.', { type: 'error' });
        } finally {
            setIsAdding(false);
        }
    }

    return (
        <div className='search-ingredient-card'>
            <div className='search-ingredient-card-title'>
                <h4>{ingredient.name}
                    {added
                    ? <GoXCircle className='remove-pantry-item-icon' onClick={handleRemoveFromPantry} />
                    : <GoPlusCircle className='add-pantry-item-icon' onClick={handleAddToPantry} />
                    }

                </h4>
                <p>{ingredient.recipeCount} {ingredient.recipeCount === 1 ? `Recipe` : `Recipes`}</p>
            </div>
            <div className='search-ingredient-card-body'>
                <Link to={`/search?q=${encodeURIComponent(ingredient.name)}&t=recipes`}>
                    <p>Explore more uses</p>
                    <GoArrowUpRight />
                </Link>
            </div>
        </div>
    )
}