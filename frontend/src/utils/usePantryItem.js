import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/toast/ToastContext';
import useLoginRedirect from './useLoginRedirect';

const url = 'http://localhost:3000/pantry';

export default function usePantryItem(name, initialInPantry = false) {
    const { token, isLoggedIn, refreshUser } = useAuth();
    const { showToast } = useToast();
    const goToLogin = useLoginRedirect();
    const [inPantry, setInPantry] = useState(!!initialInPantry);
    const [isPending, setIsPending] = useState(false);

    // Fresh data from the server wins
    useEffect(() => {
        setInPantry(!!initialInPantry);
    }, [initialInPantry]);

    // Returns true if the pantry ended up inthe wanted state
    const request = async (endpoint, wantInPantry) => {
        if (!isLoggedIn) {
            goToLogin();
            return false;
        }
        if (isPending) return false;

        const previous = inPantry;
        setInPantry(wantInPantry); // optimistic
        setIsPending(true);

        try {
            const response = await fetch(`${url}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ item: name })
            });
            const data = await response.json();

            // "already in your pantry" comes back 200, and removing something that's
            // already gone comes back 404. Both leave the pantryh in the state wanted
            if (response.ok || (!wantInPantry && response.status === 400)) {
                showToast(data.message);
                refreshUser();
                return true;
            }

            setInPantry(previous); // roll back
            showToast(data.message || data.error || 'Something went wrong.', { type: 'error' });
            return false;
        } catch (error) {
            console.error(error);
            setInPantry(previous);
            showToast('Could not update your pantry. Please try again.', { type: 'error' });
            return false;
        } finally {
            setIsPending(false);
        }
    };

    const add = () => request('new-item', true);
    const remove = () => request('delete-from-pantry', false);

    return { inPantry, isPending, add, remove }
}