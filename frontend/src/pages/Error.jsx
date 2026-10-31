import { Navigate, useNavigate, useRouteError } from 'react-router-dom';
import Header from '../components/header/Header';
import PageTitle from '../components/PageTitle';

export default function Error() {
    const error = useRouteError();
    const navigate = useNavigate();

    return (
        <div className='app'>
            <PageTitle title='Error' />
            <Header />
            <h1>Error</h1>
            <button onClick={() => navigate('/')}>To the homepage!</button>
        </div>
    )
}