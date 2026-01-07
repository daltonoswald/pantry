import { useEffect, useState } from 'react';
import { Modal,Button, Alert } from 'react-bootstrap';
// import { handleDeleteRecipe } from '../../utils/utility';

export default function ConfirmDelete({ openConfirmDelete, setOpenConfirmDelete, itemToDelete }) {
    const token = localStorage.getItem('pantryAuthToken');
    const [message, setMessage] = useState();
    console.log('cd, ', itemToDelete);

    const handleDeleteRecipe = async (itemToDelete) => {
        console.log('util-id', itemToDelete);
        const url = `http://localhost:3000/recipe/delete/${itemToDelete}`
        const recipeToDelete = {
            recipeToDelete: itemToDelete
        }
        console.log(itemToDelete);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(recipeToDelete),
                mode: 'cors',
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                window.location.reload();
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(`Error requesting: `, error);
            setMessage(error);
        }
    }

    function handleCloseModal() {
        setOpenConfirmDelete(false);
    }

    if (itemToDelete) return (
        <Modal show={openConfirmDelete} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Delete Recipe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete the recipe for {itemToDelete.title}?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={() => setOpenConfirmDelete(false)}>Close</Button>
                <Button variant='danger' onClick={() => handleDeleteRecipe(itemToDelete.id)}>Delete</Button>
            </Modal.Footer>
            {message && (
                <Modal.Footer>
                    <Alert className='m-3 p-3 mx-auto text-center' variant='danger'>{message}</Alert>  
                </Modal.Footer>
            )}
        </Modal>
    )
}