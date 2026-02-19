import { useEffect, useState } from 'react';
import { FloatingLabel, Form, Modal, Col, Row, Button, Alert } from 'react-bootstrap';

export default function EditProfile({ profileData, openEditProfile, setOpenEditProfile }) {
    const token = localStorage.getItem('pantryAuthToken');
    const [message, setMessage] = useState(null);

    function handleCloseModal() {
        setOpenEditProfile(false);
    }

    async function handleSubmitEditProfile(e) {
        e.preventDefault()
        console.log(e.target.name.value);
        console.log(e.target.bio.value)
        const url = `http://localhost:3000/user/edit-profile`
        const editData = {
            name: e.target.name.value,
            bio: e.target.bio.value
        }
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(editData)
            })
            const data = await response.json();
            if (response.ok) {
                // window.location.reload();
                console.log(data.message);
                setMessage(data.message);
                const timer = setTimeout(() => {
                    console.log('goes off after 3 seconds');
                    handleCloseModal();
                    window.location.reload();
                }, 3000)
                return () => clearTimeout(timer);
            } else {
                console.error(data.message)
                setMessage(data.message)
            }
        } catch (error) {
            console.error(`Error requesting:`, error);
            setMessage(`There was an error updating your profile. Please try again later.`);
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
                        <Button variant='primary' type='submit'>Add Item</Button>
                    </Form.Group>
                </Form>  
            </Modal.Body>
            {message && (
                <Modal.Footer>
                    <Alert className='m-3 p-3 mx-auto text-center' variant='danger'>{message}</Alert>  
                </Modal.Footer>
            )}
        </Modal>
    )
}