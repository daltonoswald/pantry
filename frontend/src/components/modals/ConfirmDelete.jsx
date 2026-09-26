import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
// import { handleDeleteRecipe } from '../../utils/utility';

export default function ConfirmDelete({ isDeleteModalOpen, setIsDeleteModalOpen, onClose, itemToDelete }) {
    const token = localStorage.getItem('pantryAuthToken');
    const [message, setMessage] = useState();

    const handleDeleteRecipe = async (itemToDelete) => {
        const url = `http://localhost:3000/recipe/delete/${itemToDelete.recipeId}`
        const recipeToDelete = {
            recipeToDelete: itemToDelete
        }
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
        setIsDeleteModalOpen(false);
    }

    if (!isDeleteModalOpen) return null

    return (
        // <Modal show={openConfirmDelete} onHide={handleCloseModal} centered>
        //     <Modal.Header closeButton>
        //         <Modal.Title>Delete Recipe</Modal.Title>
        //     </Modal.Header>
        //     <Modal.Body>
        //         <p>Are you sure you want to delete the recipe for {itemToDelete.title}?</p>
        //     </Modal.Body>
        //     <Modal.Footer>
        //         <Button variant='secondary' onClick={() => setOpenConfirmDelete(false)}>Close</Button>
        //         <Button variant='danger' onClick={() => handleDeleteRecipe(itemToDelete.id)}>Delete</Button>
        //     </Modal.Footer>
        //     {message && (
        //         <Modal.Footer>
        //             <Alert className='m-3 p-3 mx-auto text-center' variant='danger'>{message}</Alert>  
        //         </Modal.Footer>
        //     )}
        // </Modal>
        <div className='recipe-confirm-delete-modal' onClick={onClose}>
            <div className='recipe-confirm-delete-modal-content' onClick={(e) => e.stopPropagation()}>
                <MdDelete className='confirm-delete-icon' />
                <h3>Delete this Recipe?</h3>
                <p>This will permanently delete your recipe '{itemToDelete.title}' from Pantry. This action cannot be undone.</p>
                <div className='confirm-delete-button-container'>
                    <button className='cancel-delete-button'>Cancel</button>
                    <button className='confirm-delete-button'>Confirm</button>
                </div>
            </div>
        </div>
    )
}