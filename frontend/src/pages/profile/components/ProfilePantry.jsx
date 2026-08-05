import { Link } from 'react-router-dom';
import { capFirst, handleDeleteFromPantry } from '../../../utils/utility'
import { MdArrowRightAlt } from 'react-icons/md';

export default function ProfilePantry({ myData, profileData, isOwnProfile, isLoading }) {
    
    return (
    //     <Row className='h-100'>
    //     <Col className='profile-pantry border'>
    //         <h3 className='text-center'>Pantry</h3>
    //         {(profileData.pantryItems.length > 0) && (
    //             <div className='profile-recipes-list'>
    //                 {profileData.pantryItems.map((item) => (
    //                     <Row className='mb-2 pantry-item' key={item.id}>
    //                         <Col>
    //                             <p className='pantry-item-name'>{capFirst(item.pantryItem.name)}</p>
    //                         </Col>
    //                         {(isOwnProfile) && (
    //                         <Col className='col-auto'>
    //                             <Button variant='danger' type='button' onClick={() => handleDeleteFromPantry(item.id)} >
    //                                 <Trash color='black'/>
    //                             </Button>
    //                         </Col>
    //                         )}
    //                     </Row>
    //                 ))}
    //             </ div>
    //         )}
    //     </Col>
    // </Row>
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
    </div>
    </>
    )
}