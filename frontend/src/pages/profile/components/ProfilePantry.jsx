import { Link } from 'react-router-dom';
import { capFirst } from '../../../utils/utility'
import { MdArrowRightAlt } from 'react-icons/md';

export default function ProfilePantry({ profileData, isOwnProfile  }) {
    
    return (
    <>
    <div className='profile-pantry-container'>
        <div className='profile-pantry-header'>
            <h3>{isOwnProfile ? 'My Pantry' : `${profileData.username}'s Pantry`}</h3>
            <Link to={`/user/${profileData.username}/pantry`}>View All ({profileData._count.pantryItems}) <MdArrowRightAlt /></Link>
        </div>
            {(profileData.pantryItems.length > 0 && (
                <div className='profile-pantry-list'>
                    {profileData.pantryItems.map((item) => (
                        <div className='profile-pantry-item' key={item.id}>
                            <h4>{capFirst(item.pantryItem.name)}</h4>
                        </div>
                    ))}
                </div>
            ))}
            {(profileData.pantryItems.length === 0 && (
                <div className='profile-pantry-list'>
                    <h4>No pantry items found...</h4>
                </div>
            ))}
    </div>
    </>
    )
}