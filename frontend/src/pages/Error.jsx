import { Navigate, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Error() {
    const navigate = useNavigate()

    return (
        <div className='app'>
            <Header />
            <h1>Error</h1>
            <button onClick={() => navigate('/')}>To the homepage!</button>
        </div>
    )
}