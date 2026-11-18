import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../toast/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function ConfirmDelete({ isDeleteModalOpen, setIsDeleteModalOpen, onClose }) {
    const { showToast } = useToast();
    const { token, refreshUser } = useAuth();
    const navigate = useNavigate();

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
                showToast(data.message);
                refreshUser();
                navigate('/');
            } else {
                showToast(data.message || data.error, { type: 'error' });
            }
        } catch (error) {
            console.error(`Error requesting: `, error);
            showToast('Could not delete this recipe. Please try again.')
        }
    }

    function handleCloseModal() {
        setIsDeleteModalOpen(false);
    }

    if (!isDeleteModalOpen) return null

    return (
        <div className='recipe-confirm-delete-modal' onClick={onClose}>
            <div className='recipe-confirm-delete-modal-content' onClick={(e) => e.stopPropagation()}>
                <MdDelete className='confirm-delete-icon' />
                <h3>Delete this Recipe?</h3>
                <p>This will permanently delete your recipe '{itemToDelete.title}' from your collection and from Pantry.</p>
                <p>This action cannot be undone.</p>
                <div className='confirm-delete-button-container'>
                    <button className='cancel-delete-button' onClick={handleCloseModal}>Cancel</button>
                    <button className='confirm-delete-button' onClick={() => handleDeleteRecipe(itemToDelete.id)}>Confirm</button>
                </div>
            </div>
        </div>
    )
}