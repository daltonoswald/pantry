import { useState, useEffect } from 'react';
import { toggleFavoriteRecipe } from './utility';
import { useToast } from '../components/toast/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function useFavoriteRecipe(recipe) {
    const { showToast } = useToast();
    const { refreshUser } = useAuth();
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

        if (result.success) refreshUser();
    };

    return { isFavorited, favoriteCount, toggle };
}