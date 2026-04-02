import { useState } from 'react';
import { Col, Container, Nav, Navbar, NavDropdown, Row, Form, Button } from 'react-bootstrap'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import NewPantryItem from './modals/NewPantryItem';
import { Search } from 'react-bootstrap-icons';

export default function Header() {
    const [openNewPantryItem, setOpenNewPantryItem] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const token = localStorage.getItem('pantryAuthToken');
    const username = localStorage.getItem('pantryUsername');

    function handleOpenNewPantryItem() {
        setOpenNewPantryItem(!openNewPantryItem)
    }

    function logout() {
        localStorage.removeItem('pantryAuthToken');
        localStorage.removeItem('pantryUsername');
        navigate('/');
    }

    function handleNavSearch(e) {
        e.preventDefault()
        navigate(`/search?q=${e.target.query.value}&t=all`)
    }

    return (
        <>
        <Navbar sticky='top' expand='lg' className='pantry-heading mb-3 d-flex justify-content-around' >
            {/* <Container fluid className='pantry-primary mx-2'> */}
                <Row>
                    <Navbar.Brand as={Link} to='/'>Pantry</Navbar.Brand>
                </Row>
                <Row>
                    <Col>
                        <Form className='d-flex' onSubmit={handleNavSearch}>
                            <Form.Control
                                type='search'
                                name='query'
                                placeholder='Search...'
                                className='me-2'
                                defaultValue={query || ''}
                                aria-label='Search'
                            />
                            <Button type='submit' className='pantry-secondary'>
                                <Search color='white' />
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row className='text-light pantry-heading'>
                    {!token && (
                        <Col>
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
                        </Col>
                    )}
                    {token && (
                        <Col md='auto' className='d-flex align-items-center'>
                            <NavDropdown title={username} className='pantry-heading' >
                                <NavDropdown.Item as={Link} to={`/user/${username}`} className='pantry-heading'>{username}</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to={'/search'} reloadDocument className='pantry-heading'>Search</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to={'/new-recipe'} className='pantry-heading'>New Recipe</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleOpenNewPantryItem} className='pantry-heading'>New Pantry Item</NavDropdown.Item>
                                <NavDropdown.Item onClick={logout} className='pantry-heading'>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Col>
                    )}
                </Row>
            {/* </Container> */}
        </Navbar>
        <NewPantryItem openNewPantryItem={openNewPantryItem} setOpenNewPantryItem={setOpenNewPantryItem} />
        </>
    )
}