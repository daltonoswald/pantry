import { Row, Col, Button } from 'react-bootstrap';
import { Trash,} from 'react-bootstrap-icons';
import { handleDeleteRecipe, favoriteRecipe, unfavoriteRecipe } from '../../../utils/utility'
import { Link } from 'react-router-dom';
import ConfirmDelete from '../../../components/modals/ConfirmDelete'
import { useState } from 'react';
import { MdArrowRightAlt } from 'react-icons/md';
import { FiClock } from 'react-icons/fi';
import { GoHeart, GoHeartFill } from 'react-icons/go'
import kitchenImg from '../../../assets/temp-stock-photos/kitchen.jpg'

export default function ProfileRecipes({ myData, profileData, isOwnProfile, isLoading }) {
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    console.log(profileData.recipes)
    console.log('mydata', myData);

    function handleOpenConfirmDelete(id) {
        setOpenConfirmDelete(!openConfirmDelete)
        setItemToDelete(id)
    }

    return (
        <>
        {/* <Row className='h-100'>
            <Col className='profile-recipes border'>
                <h3 className='text-center'>Recipes By {profileData.username}</h3>
                {(profileData.recipes.length > 0) && (
                    <div className='profile-recipes-list'>
                        {profileData.recipes.map((item) => (
                            <Row key={item.id} className='mb-2 recipe-item'>
                                <Col>
                                    <Link to={`/recipe/${item.id}`} className='recipe-item'>{item.title}</Link>
                                </Col>
                                {(profileData.id === myData?.id) && (
                                <Col className='col-auto'>
                                    <Button variant='danger' type='button' onClick={() => handleOpenConfirmDelete(item)} >
                                        <Trash color='black'/>
                                    </Button>
                                </Col>
                                )}
                            </Row>
                        ))}
                    </div>
                )}
                {(profileData.recipes.length <= 0) && (
                    <>
                        <p className='text-center'>No recipes yet...</p>
                    </>
                )}
            </Col>
        </Row> */}
        <div className='profile-recipes-container'>
            <div className='profile-recipes-header'>
                <h3>My Recipes</h3>
                <Link to={`/user/${profileData.username}/all-recipes`}>View All <MdArrowRightAlt /></Link>
            </div>
            {(profileData.recipes.length > 0) && (
                <div className='profile-recipes-list'>
                {profileData.recipes.map((item) => (
                    <div className='profile-recipe-card'>
                        <div className='profile-recipe-image-container'>
                            <Link to={`/recipe/${item.id}`}>
                                <img src={item.image || kitchenImg} className='profile-recipe-image' alt='recipe image' />
                            </Link>
                        </div>
                        <div className='profile-recipe-about'>
                            <div className='profile-recipe-about-favorites-time'>
                                <div className='profile-recipe-favorites'>
                                    {(item.isFavorited && myData) && (
                                        <GoHeartFill className='favorited' onClick={() => favoriteRecipe(item.id)} />
                                    )}
                                    {(!item.isFavorited && myData) && (
                                        <GoHeart className='not-favorited' onClick={() => unfavoriteRecipe(item.id)} />
                                    )}
                                    {(!item.isFavorited && !myData) && (
                                        <GoHeart className='not-favorited' />
                                    )}
                                    <p>{item._count.favorites}</p>
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
                ))}
                </div>
            )}
        </div>
    <ConfirmDelete openConfirmDelete={openConfirmDelete} setOpenConfirmDelete={setOpenConfirmDelete} itemToDelete={itemToDelete} />
    </>
    )
}