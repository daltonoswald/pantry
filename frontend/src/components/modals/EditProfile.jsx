import { useEffect, useState } from 'react';
import { updateProfile } from '../../utils/utility';
import Alert from '../modals/Alert';

export default function EditProfile({ profileData, openEditProfile, setOpenEditProfile, onClose }) {
    const token = localStorage.getItem('pantryAuthToken');
    const [message, setMessage] = useState(null);
    const [success, setSuccess] = useState();

    const handleSubmitEditProfile = async (e) => {
        e.preventDefault();
        setMessage(null);
        const editData = {
            name: e.target.name.value,
            bio: e.target.bio.value
        }
        const result = await updateProfile(editData);

        if (result.success) {
            setMessage(result.message);
            setSuccess(result.success);
            const timer = setTimeout(() => {
                onClose();
                window.location.reload();
            }, 3000)
            return () => clearTimeout(timer);
        } else {
            setMessage({ type: 'danger', text: result.message || 'Failed to update profile.'})
        }
    }

    if (!openEditProfile) return null;

    return (
        <div className='edit-profile-modal' onClick={onClose}>
            <div className='edit-profile-modal-content' onClick={(e) => e.stopPropagation()}>
                <button className='modal-close-button' onClick={onClose}>
                    &times;
                </button>
                <form className='edit-profile-form' onSubmit={handleSubmitEditProfile}>
                    <div className='form-group'>
                        <label htmlFor='name' className='form-label'>Name</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            className='form-input'
                            placeholder={profileData.name}
                            defaultValue={profileData.name}
                            required />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='bio' className='form-label'>Bio</label>
                        <input
                            type='text'
                            id='bio'
                            name='bio'
                            className='form-input'
                            placeholder={profileData.bio}
                            defaultValue={profileData.bio}
                            required />
                    </div>
                    <div className='form-group modal-submit-container'>
                        <button className='submit-button modal-submit-button' type='submit'>Save</button>
                    </div>
                </form>
                    {message && (
                        <Alert success={success} message={message} />
                    )}
            </div>

        </div>
    )
}