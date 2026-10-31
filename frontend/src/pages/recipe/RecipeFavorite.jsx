import { GoHeart, GoHeartFill } from 'react-icons/go';
import { useAuth } from '../../context/AuthContext';
import useLoginRedirect from '../../utils/useLoginRedirect';
import useFavoriteRecipe from '../../utils/useFavoriteRecipes';

export default function RecipeFavorite({ recipe, isAuthor }) {
    const { isLoggedIn } = useAuth();
    const goToLogin = useLoginRedirect();
    const { isFavorited, favoriteCount, toggle } = useFavoriteRecipe(recipe);

    let heart;
    if (!isLoggedIn) {
        heart = <GoHeart className='not-favorited icon-link' onClick={goToLogin} />;
    } else if (isAuthor) {
        heart = <GoHeart className='not-favorited' />
    } else if (isFavorited) {
        heart = <GoHeartFill className='favorited icon-link' onClick={toggle} />
    } else {
        heart = <GoHeart className='not-favorited icon-link' onClick={toggle} />
    }

    return <div className='recipe-info-favorite'>
        {heart}
        <p>{favoriteCount}</p>
    </div>
}