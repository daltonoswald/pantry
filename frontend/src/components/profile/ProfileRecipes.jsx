import { Row, Col, Button } from 'react-bootstrap';
import { Trash,} from 'react-bootstrap-icons';
import { handleDeleteRecipe} from '../../utils/utility'
import { Link } from 'react-router-dom';
import ConfirmDelete from '../modals/ConfirmDelete';
import { useState } from 'react';

export default function ProfileRecipes({ myData, profileData }) {
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    function handleOpenConfirmDelete(id) {
        setOpenConfirmDelete(!openConfirmDelete)
        setItemToDelete(id)
        console.log('13, ', id)
    }

    return (
        <>
        <Row className='h-100'>
            <Col className='profile-recipes border'>
                <h3 className='text-center'>Recipes By {profileData.username}</h3>
                {(profileData.recipes.length > 0) && (
                    <div className='profile-recipes-list'>
                        {profileData.recipes.map((item) => (
                            <Row key={item.id}>
                                <Col>
                                    <Link to={`/recipe/${item.id}`} className='recipe-item'>{item.title}</Link>
                                </Col>
                                {(profileData.id === myData?.id) && (
                                <Col>
                                    {/* <Button variant='danger' type='button' onClick={() => handleOpenConfirmDelete(item.id)} > */}
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
    </Row>
    <ConfirmDelete openConfirmDelete={openConfirmDelete} setOpenConfirmDelete={setOpenConfirmDelete} itemToDelete={itemToDelete} />
    </>
    )
}