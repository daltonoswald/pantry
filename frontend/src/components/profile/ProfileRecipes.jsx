import { Row, Col, Button } from 'react-bootstrap';
import { Trash,} from 'react-bootstrap-icons';
import { capFirst, handleDeleteFromPantry } from '../../utils/utility'

export default function ProfileRecipes({ myData, profileData }) {
    return (
        <Row className='h-100'>
            <Col className='profile-recipes border'>
                <h3 className='text-center'>Recipes By {profileData.username}</h3>
                {(profileData.recipes.length > 0) && (
                    <>
                        {profileData.recipes.map((item) => (
                            <Row key={item.id}>
                                <Col>
                                    <p className='recipe-item'>{item.title}</p>
                                </Col>
                                {(profileData.id === myData.id) && (
                                <Col>
                                    <Button variant='danger' type='button' onClick={() => console.log('delete recipe')} >
                                        <Trash color='black'/>
                                    </Button>
                                </Col>
                                )}
                            </Row>
                        ))}
                    </>
                )}
                {(profileData.recipes.length <= 0) && (
                    <>
                        <p className='text-center'>No recipes yet...</p>
                    </>
                )}
            </Col>
    </Row>
    )
}