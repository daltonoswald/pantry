import { useState, useEffect } from 'react';
import { toggleFavoriteRecipe } from './utility';
import { useToast } from '../components/toast/ToastContext';

export default function useFavoriteRecipe(recipe) {
    const { showToast } = useToast();
    const [isFavorited, setIsFavorited] = useState(!!recipe.isFavorited);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        setIsFavorited(!!recipe.isFavorited);
    }, [recipe.isFavorited])

    const favoriteCount = recipe._count.favorites + (isFavorited ? 1 : 0) - (recipe.isFavorited ? 1 : 0)

    const toggle = async () => {
        if (isPending) return;
        const previous = isFavorited;
        setIsFavorited(!previous);
        setIsPending(true);

        const result = await toggleFavoriteRecipe(recipe.id);

        setIsPending(false);
        setIsFavorited(result.success ? result.isFavorited : previous);
        showToast(result.message, { type: result.success ? 'success' : 'error' });
    };

    return { isFavorited, favoriteCount, toggle };
}