import { Navigate, useNavigate } from 'react-router-dom';

export default function Error() {
    const navigate = useNavigate()

    return (
        <div>
            <h1>Error</h1>
            <button onClick={() => navigate('/')}>To the homepage!</button>
        </div>
    )
}