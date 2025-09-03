import { Col, Container, Nav, Navbar, NavDropdown, Row } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Header() {
    const navigate = useNavigate();
    const token = localStorage.getItem('pantryAuthToken');
    const username = localStorage.getItem('pantryUsername');

    function logout() {
        localStorage.removeItem('pantryAuthToken');
        localStorage.removeItem('pantryUsername');
        navigate('/');
    }

    return (
        <Navbar expand='lg' className='bg-body-tertiary mb-3' data-bs-theme='dark'>
            <Container>
                <Navbar.Brand as={Link} to='/'>Pantry</Navbar.Brand>
                <Row className='text-light'>
                {!token && (
                    <>
                        <Col>
                            <Nav.Item>
                                <Nav.Link as={Link} to='/login'>Log in</Nav.Link>
                            </Nav.Item>
                        </Col>
                        <Col>
                            <Nav.Item>
                                <Nav.Link as={Link} to='/sign-up'>Sign up</Nav.Link>
                            </Nav.Item>
                        </Col>
                    </>
                )}
                {token && (
                    <NavDropdown title={username}>
                        <NavDropdown.Item as={Link} to={`/user/${username}`}>{username}</NavDropdown.Item>
                        <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                )}
                </Row>
            </Container>
        </Navbar>
    )
}