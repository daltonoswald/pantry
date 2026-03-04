import { useEffect, useState } from 'react';

export default function Recommendations() {
    const [recipes, setRecipes] = useState([]);
    const [pantryCount, setPantryCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            const token = localStorage.getItem('pantryAuthToken');
            const limit = 5
            const url = `http://localhost:3000/recipe/by-pantry?limit=${limit}`
            try {
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setRecipes(data.recipes);
                    setPantryCount(data.pantryItemCount);
                    console.log(data);
                }
            } catch (error) {
                console.error('Error', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipes();
    }, [])
}