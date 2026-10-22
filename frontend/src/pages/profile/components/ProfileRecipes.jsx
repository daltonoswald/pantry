import { Link } from 'react-router-dom';
import ConfirmDelete from '../../../components/modals/ConfirmDelete'
import { useState } from 'react';
import { MdArrowRightAlt } from 'react-icons/md';
import ProfileRecipeCard from './ProfileRecipeCard';

export default function ProfileRecipes({ myData, profileData, isOwnProfile, isLoading }) {
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    return (
        <>
        <div className='profile-recipes-container'>
            <div className='profile-recipes-header'>
                <h3>My Recipes</h3>
                <Link to={`/user/${profileData.username}/all-recipes`}>View All ({profileData._count.recipes}) <MdArrowRightAlt /></Link>
            </div>
            {(profileData.recipes.length > 0) && (
                <div className='profile-recipes-list'>
                {profileData.recipes.map((item) => (
                    <ProfileRecipeCard key={item.id} item={item} myData={myData} isOwnProfile={isOwnProfile} />
                ))}
                </div>
            )}
            {(profileData.recipes.length <= 0) && (
                <h4>No recipes found...</h4>
            )}
        </div>
        <ConfirmDelete openConfirmDelete={openConfirmDelete} setOpenConfirmDelete={setOpenConfirmDelete} itemToDelete={itemToDelete} />
    </>
    )
}