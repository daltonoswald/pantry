import { Link, useNavigate } from 'react-router-dom';
import { Alert, Container } from 'react-bootstrap';

export default function ErrorModal({ error }) {

    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('pantryAuthToken');
        localStorage.removeItem('pantryUsername');
        navigate('/');
    }

    console.log(error)

    // const formattedError = JSON.parse(error);

    return (
        <Container>
            <Alert className='w-25 mx-auto my-auto' variant={'danger'}>
                {/* <p>Error Status {formattedError.error.status}: {formattedError.error.message}</p> */}
                <p>Error Message: {error}</p>
                <p>If this error persists and looks incorrect please contact the site owner</p>
                <Link to='/' onClick={logout}>Logout and try again.</Link>
            </Alert>
        </Container>
    )
}