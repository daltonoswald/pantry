import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ErrorModal({ error }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    console.log(error)

    // const formattedError = JSON.parse(error);

    // return (
    //     <Container>
    //         <Alert className='w-25 mx-auto my-auto' variant={'danger'}>
    //             {/* <p>Error Status {formattedError.error.status}: {formattedError.error.message}</p> */}
    //             <p>Error Message: {error.text}</p>
    //             <p>If this error persists and looks incorrect please contact the site owner</p>
    //             <Link to='/' onClick={logout}>Logout and try again.</Link>
    //         </Alert>
    //     </Container>
    // )
}