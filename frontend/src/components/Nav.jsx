import { Container, Navbar } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Nav() {

    return (
        <Navbar expand='lg' className='bg-body-tertiary mb-3' data-bs-theme='dark'>
            <Container>
                <Navbar.Brand as={Link} to='/'>Pantry</Navbar.Brand>
            </Container>
        </Navbar>
    )
}