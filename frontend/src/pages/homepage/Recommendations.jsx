import { useEffect, useState } from 'react';
import { getRecipesByPantry } from '../../utils/utility';

export default function Recommendations() {
    const [recipes, setRecipes] = useState([]);
    const [pantryCount, setPantryCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleFetchRecipesByPantry = async () => {
            // setMessage(null)
            const result = await getRecipesByPantry();

            if (result.success) {
                console.log('by pantry', result.data);
            } else {
                // setMessage({ type: 'danger', text: result.message || 'Faled to retrieve recipes.' })
            }
        }
        handleFetchRecipesByPantry();
    }, [])
}