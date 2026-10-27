import { useEffect, useState } from 'react';
import Alert from '../modals/Alert';
import { useToast } from '../toast/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function NewPantryItem({ isOpen, setIsModalOpen, onClose }) {
    const [message, setMessage] = useState();
    const [success, setSuccess] = useState();
    const { showToast } = useToast();
    const { token, refreshUser } = useAuth();

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
                console.log(data.message);
                showToast(data.message);
                refreshUser();
                setSuccess(null);
                setIsModalOpen(false);
            } else {
                console.error(data.message)
                showToast(data.message || data.error, { type: 'error' });
                setSuccess(data.success);
            }
        } catch (error) {
            console.error(`Error requesting:`, error);
            showToast('Could not add to your pantry. Please try again', { type: 'error' });
            setSuccess(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className='new-pantry-item-modal' onClick={onClose}>
            <div className='new-pantry-item-modal-content' onClick={(e) => e.stopPropagation()}>
                <button className='modal-close-button' onClick={onClose}>
                    &times;
                </button>
                <form className='new-pantry-item-form' onSubmit={handleSubmitPantryItem}>
                    <div className='form-group'>
                        <label htmlFor='formItem' className='form-label'>Add To Your Pantry</label>
                        <input 
                            type='text'
                            id='item'
                            name='item'
                            placeholder='Item'
                            className='form-input'
                            required
                            />
                    </div>
                    <div className='form-group modal-submit-container'>
                        <button className='submit-button modal-submit-button' type='submit'>Add</button>
                    </div>
                </form>

                {message && (
                    <Alert success={success} message={message} />
                )}
            </div>
        </div>
    )
}