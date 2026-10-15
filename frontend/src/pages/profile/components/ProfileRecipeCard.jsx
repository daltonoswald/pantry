import useFavoriteRecipe from '../../../utils/useFavoriteRecipes';
import useLoginRedirect from '../../../utils/useLoginRedirect';
import { Link } from 'react-router-dom';
import ConfirmDelete from '../../../components/modals/ConfirmDelete'
import { useState } from 'react';
import { MdArrowRightAlt } from 'react-icons/md';
import { FiClock } from 'react-icons/fi';
import { GoHeart, GoHeartFill } from 'react-icons/go'
import kitchenImg from '../../../assets/temp-stock-photos/kitchen.jpg'

export default function ProfileRecipeCard({ item, myData, isOwnProfile }) {
    const goToLogin = useLoginRedirect();
    const { isFavorited, favoriteCount, toggle } = useFavoriteRecipe(item);

    return (
        <div className='profile-recipe-card'>
            <div className='profile-recipe-image-container'>
                <Link to={`/recipe/${item.id}`}>
                    <img src={item.image || kitchenImg} className='profile-recipe-image' alt='recipe image' />
                </Link>
            </div>
            <div className='profile-recipe-about'>
                <div className='profile-recipe-about-favorites-time'>
                    <div className='profile-recipe-favorites'>
                        {myData ? (
                            isFavorited
                                ? <GoHeartFill className='favorited' onClick={isOwnProfile ? undefined : toggle} />
                                : <GoHeart className='not-favorited' onClick={isOwnProfile ? undefined : toggle} />
                            ) : (
                            <GoHeart className='not-favorited' onClick={goToLogin} />
                        )}
                            <p>{favoriteCount}</p>
                    </div>
                    <div className='profile-recipe-time'>
                        <FiClock />
                        <p>{item.cookTime} mins</p>
                    </div>
                </div>
                <h4 className='profile-recipe-title'><Link to={`/recipe/${item.id}`}>{item.title}</Link></h4>
                <p>{item.description}</p>
            </div>
        </div>
    )
}