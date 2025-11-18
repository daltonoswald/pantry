import { Row, Col, Button } from 'react-bootstrap';
import { Trash,} from 'react-bootstrap-icons';
import { capFirst, handleDeleteFromPantry } from '../../utils/utility'

export default function ProfilePantry({ myData, profileData }) {
    
    return (
        <Row className='h-100'>
        <Col className='profile-pantry border'>
            <h3 className='text-center'>Pantry</h3>
            {(profileData.pantryItems.length > 0) && (
                <div className='profile-recipes-list'>
                    {profileData.pantryItems.map((item) => (
                        <Row className='mb-2 pantry-item' key={item.id}>
                            <Col>
                                <p className='pantry-item-name'>{capFirst(item.pantryItem.name)}</p>
                            </Col>
                            {(profileData.id === myData.id) && (
                            <Col className='col-auto'>
                                <Button variant='danger' type='button' onClick={() => handleDeleteFromPantry(item.id)} >
                                    <Trash color='black'/>
                                </Button>
                            </Col>
                            )}
                        </Row>
                    ))}
                </ div>
            )}
        </Col>
    </Row>
    )
}