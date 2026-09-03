import { useEffect, useState } from 'react';
import Alert from '../modals/Alert';

export default function NewPantryItem({ isOpen, setIsModalOpen, onClose }) {
    const token = localStorage.getItem('pantryAuthToken');
    const [message, setMessage] = useState();

    // function handleCloseModal() {
    //     setOpenNewPantryItem(false);
    // }

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
                console.log(data.message);
                setMessage(data.message);
                const timer = setTimeout(() => {
                    console.log('goes off after 3 seconds');
                    setIsModalOpen(false);
                }, 3000)
                return () => clearTimeout(timer);
            } else {
                console.error(data.message)
                setMessage(data.message)
            }
        } catch (error) {
            console.error(`Error requesting:`, error);
            setMessage(`There was an error adding your pantry item. Please try again later.`);
        }
    }

    if (!isOpen) return null;

    return (
        <div className='new-pantry-item-modal' onClick={onClose}>
            <div className='new-pantry-item-modal-content' onClick={(e) => e.stopPropagation()}>
                <button className='modal-close-button' onClick={onClose}>
                    &times;
                </button>
                {/* <h3>Add To Your Pantry</h3> */}
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

                {/* Adjust this to reflect error message vs. confirmation message */}

                {message && (
                    <Alert message={message} />
                )}
            </div>
        </div>
    )
}