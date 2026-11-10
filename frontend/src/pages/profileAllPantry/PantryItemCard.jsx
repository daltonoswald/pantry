import { useState, useEffect } from 'react';
import { GoPlusCircle, GoCheckCircle } from 'react-icons/go';
import { MdClose } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/toast/ToastContext';
import useLoginRedirect from '../../utils/useLoginRedirect';
import { capFirst } from '../../utils/utility';

export default function PantryItemCard({ item, isOwnProfile, onRemove }) {
    const { isLoggedIn, token, refreshUser } = useAuth();
    const { showToast } = useToast();
    const goToLogin = useLoginRedirect();
    const [added, setAdded] = useState(!!item.inMyPantry);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        setAdded(!!item.inMyPantry);
    }, [item.inMyPantry]);

    const handleAdd = async () => {
        if (!isLoggedIn) return goToLogin();
        if (isAdding || added) return;

        setIsAdding(true);
        try {
            const url = 'http://localhost:3000/pantry/new-item';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ item: item.pantryItem.name })
            });
            const data = await response.json();
            if (response.ok) {
                setAdded(true);
                showToast(data.message);
                refreshUser();
            } else {
                showToast(data.message || data.error, {type: 'error' });
            }
        } catch (error) {
            console.error(error);
            showToast('Could not add to your pantry. Please try again later.', { type: 'error' });
        } finally {
            setIsAdding(false);
        }
    };

    const name = capFirst(item.pantryItem.name);

    return (
        <div className='pantry-item'>
            <h4>{name}</h4>

            {isOwnProfile ? (
                <button
                    className='pantry-item-remove'
                    aria-label={`Remove ${name} from your pantry`}
                    onClick={() => onRemove(item)}
                >
                    <MdClose />
                </button>
            ) : added ? (
                <span className='pantry-item-in-pantry' title='In your pantry'>
                    <GoCheckCircle aria-label='In your pantry' />
                </span>
            ) : (
                <button
                    className='pantry-item-add'
                    aria-label={`Add ${name} to your pantry`}
                    onClick={handleAdd}
                    disabled={isAdding}
                >
                    <GoPlusCircle />
                </button>
            )}
        </div>
    )
}