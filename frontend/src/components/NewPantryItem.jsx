import { FloatingLabel, Form, Modal, Col, Row, Button } from 'react-bootstrap';

export default function NewPantryItem({ openNewPantryItem, setOpenNewPantryItem}) {

    function handleCloseModal() {
        setOpenNewPantryItem(false);
    }

    async function handleSubmitPantryItem(e) {
        e.preventDefault()
        console.log(e.target.item.value);
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
        </Modal>
    )
}