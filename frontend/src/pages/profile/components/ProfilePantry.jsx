import { Link } from 'react-router-dom';
import { capFirst, handleDeleteFromPantry } from '../../../utils/utility'
import { MdArrowRightAlt } from 'react-icons/md';

export default function ProfilePantry({ myData, profileData, isOwnProfile, isLoading }) {
    
    return (
    <>
    <div className='profile-pantry-container'>
        <div className='profile-pantry-header'>
            <h3>My Pantry</h3>
            <Link to={`/user/${profileData.username}/pantry`}>View All ({profileData._count.pantryItems}) <MdArrowRightAlt /></Link>
        </div>
            {(profileData.pantryItems.length > 0 && (
                <div className='profile-pantry-list'>
                    {profileData.pantryItems.map((item) => (
                        <div classname='profile-pantry-item'>
                            <h4>{capFirst(item.pantryItem.name)}</h4>
                        </div>
                    ))}
                </div>
            ))}
            {(profileData.pantryItems <= 0 && (
                <div className='profile-pantry-list'>
                    <h4>No pantry items found...</h4>
                </div>
            ))}
    </div>
    </>
    )
}