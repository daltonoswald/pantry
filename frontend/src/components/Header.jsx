import { useState } from 'react';
import { Col, Container, Nav, Navbar, NavDropdown, Row, Form, Button } from 'react-bootstrap'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import NewPantryItem from './NewPantryItem';
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
        <Navbar expand='lg' className='pantry-primary mb-3' >
            <Container fluid className='pantry-primary mx-5'>
                <Row>
                    <Navbar.Brand as={Link} to='/'>Pantry</Navbar.Brand>
                </Row>
                <Row className='text-light pantry-primary ms-auto'>
                    <Col>
                        <Form className='d-flex' onSubmit={handleNavSearch}>
                            <Form.Control
                                type='search'
                                name='query'
                                placeholder='search'
                                className='me-2'
                                defaultValue={query || ''}
                                aria-label='Search'
                            />
                            <Button type='submit'>
                                <Search color='white' />
                            </Button>
                        </Form>
                    </Col>
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
                            <NavDropdown title={username} className='pantry-primary'>
                                <NavDropdown.Item as={Link} to={`/user/${username}`} className='pantry-primary'>{username}</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to={'/search'} reloadDocument className='pantry-primary'>Search</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to={'/new-recipe'} className='pantry-primary'>New Recipe</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleOpenNewPantryItem} className='pantry-primary'>New Pantry Item</NavDropdown.Item>
                                <NavDropdown.Item onClick={logout} className='pantry-primary'>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Col>
                    )}
                </Row>
            </Container>
        </Navbar>
        <NewPantryItem openNewPantryItem={openNewPantryItem} setOpenNewPantryItem={setOpenNewPantryItem} />
        </>
    )
}