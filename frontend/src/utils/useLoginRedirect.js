import { useNavigate } from 'react-router-dom';

export default function useLoginRedirect() {
    const navigate = useNavigate();

    return () => navigate('/login', {
        state: { from: window.location.pathname + window.location.search }
    });
}