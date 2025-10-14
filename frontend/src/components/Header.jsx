import { useState } from 'react';
import { Col, Container, Nav, Navbar, NavDropdown, Row } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import NewPantryItem from './NewPantryItem';

export default function Header() {
    const [openNewPantryItem, setOpenNewPantryItem] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('pantryAuthToken');
    const username = localStorage.getItem('pantryUsername');

    function handleOpenNewPantryItem() {
        if (!openNewPantryItem) {
            setOpenNewPantryItem(true)
        } else {
            setOpenNewPantryItem(false)
        }
    }

    function logout() {
        localStorage.removeItem('pantryAuthToken');
        localStorage.removeItem('pantryUsername');
        navigate('/');
    }

    return (
        <>
        <Navbar expand='lg' className='pantry-primary mb-3' data-bs-theme='dark'>
            <Container className='pantry-primary'>
                <Navbar.Brand as={Link} to='/'>Pantry</Navbar.Brand>
                <Row className='text-light pantry-primary'>
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
                    <NavDropdown title={username} className='pantry-primary'>
                        <NavDropdown.Item as={Link} to={`/user/${username}`} className='pantry-primary'>{username}</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to={'/new-recipe'} className='pantry-primary'>New Recipe</NavDropdown.Item>
                        <NavDropdown.Item onClick={handleOpenNewPantryItem} className='pantry-primary'>New Pantry Item</NavDropdown.Item>
                        <NavDropdown.Item onClick={logout} className='pantry-primary'>Logout</NavDropdown.Item>
                    </NavDropdown>
                )}
                </Row>
            </Container>
        </Navbar>
        <NewPantryItem openNewPantryItem={openNewPantryItem} setOpenNewPantryItem={setOpenNewPantryItem} />
        </>
    )
}