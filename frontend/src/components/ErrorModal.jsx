import { Link, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

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
        <>
            <Container>
                {/* <p>Error Status {formattedError.error.status}: {formattedError.error.message}</p> */}
                <p>If this error persists and looks incorrect please contact the site owner</p>
                <Link to='/' onClick={logout}>Logout and try again.</Link>
            </Container>
        </>
    )
}