import { useEffect, useState } from 'react';

export default function Recommendations({ makeableRecipes, recipesByPantry }) {
    const [recipes, setRecipes] = useState([]);
    const [pantryCount, setPantryCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

}