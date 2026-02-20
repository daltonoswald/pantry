import { useEffect, useState } from 'react';
import { FloatingLabel, Form, Modal, Col, Row, Button, Alert } from 'react-bootstrap';
import { updateProfile } from '../../utils/utility';

export default function EditProfile({ profileData, openEditProfile, setOpenEditProfile }) {
    const token = localStorage.getItem('pantryAuthToken');
    const [message, setMessage] = useState(null);

    function handleCloseModal() {
        setOpenEditProfile(false);
    }

    const handleSubmitEditProfile = async (e) => {
        e.preventDefault();
        setMessage(null);
        const editData = {
            name: e.target.name.value,
            bio: e.target.bio.value
        }
        const result = await updateProfile(editData);

        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            const timer = setTimeout(() => {
                console.log('goes off after 3 seconds');
                handleCloseModal();
                window.location.reload();
            }, 3000)
            return () => clearTimeout(timer);
        } else {
            setMessage({ type: 'danger', text: result.message || 'Failed to update profile.'})
        }
    }

    return (
        <Modal show={openEditProfile} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmitEditProfile}>
                    <Form.Group>
                        <Col className='mb-3'>
                            <FloatingLabel controlid='formName' label='Name'>
                                <Form.Control name='name' type='text' placeholder='Name' defaultValue={profileData.name}/>
                            </FloatingLabel>
                        </Col>
                        <Col className='mb-3'>
                            <FloatingLabel controlid='formBio' label='Bio'>
                                <Form.Control name='bio' type='text' placeholder='Bio' defaultValue={profileData.bio}/>
                            </FloatingLabel>
                        </Col>
                    </Form.Group>
                    <Form.Group className='float-end'>
                        <Button className='mx-2' variant='secondary' onClick={handleCloseModal}>Close</Button>
                        <Button variant='primary' type='submit'>Save Changes</Button>
                    </Form.Group>
                </Form>  
            </Modal.Body>
            {message && (
                <Modal.Footer>
                    <Alert className='m-3 p-3 mx-auto text-center' variant={message.type}>{message.text}</Alert>  
                </Modal.Footer>
            )}
        </Modal>
    )
}