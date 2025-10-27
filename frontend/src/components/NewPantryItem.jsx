import { useState } from 'react';
import { FloatingLabel, Form, Modal, Col, Row, Button, Alert } from 'react-bootstrap';

export default function NewPantryItem({ openNewPantryItem, setOpenNewPantryItem}) {
    const token = localStorage.getItem('pantryAuthToken');
    const [message, setMessage] = useState();

    function handleCloseModal() {
        setOpenNewPantryItem(false);
    }

    async function handleSubmitPantryItem(e) {
        e.preventDefault()
        console.log(e.target.item.value);
        const url = `http://localhost:3000/pantry/new-item`
        const pantryData = {
            item: e.target.item.value
        }
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(pantryData)
            })
            const data = await response.json();
            if (response.ok) {
                // window.location.reload();
                console.log(response);
            } else {
                console.error(data.message)
                setMessage(data.message)
            }
        } catch (error) {
            console.error(`Error requesting:`, error);
            setMessage(`There was an error adding your pantry item. Please try again later.`);
        }
    }

    return (
        <Modal show={openNewPantryItem} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add To Your Pantry</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmitPantryItem}>
                    <Form.Group className='mb-3' controlId='formItem'>
                            <FloatingLabel controlId='formItem' label='Item'>
                                <Form.Control name='item' type='text' placeholder='Item' autoFocus />
                            </FloatingLabel>
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