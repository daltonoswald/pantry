import { useState } from 'react';
import { Col, Container, Nav, Navbar, NavDropdown, Row, Form, Button } from 'react-bootstrap'
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './header.styles.css'
import NewPantryItem from '../modals/NewPantryItem';
import { Search, PersonCircle } from 'react-bootstrap-icons';

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
        {/* <Navbar sticky='top' expand='lg' className='pantry-nav d-flex justify-content-around' >
                <Row>
                    <Navbar.Brand as={Link} to='/'>Pantry</Navbar.Brand>
                </Row>
                <Row>
                    <Col>
                        <Nav.Item>
                            <Nav.Link as={Link} to='/'>Recipes</Nav.Link>
                        </Nav.Item>
                    </Col>
                    <Col>
                        <Nav.Item>
                            <Nav.Link as={Link} to='/search'>Search</Nav.Link>
                        </Nav.Item>
                    </Col>
                    <Col>
                        <Nav.Item>
                            <Nav.Link as={Link} to='/about'>About</Nav.Link>
                        </Nav.Item>
                    </Col>
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
        </Navbar> */}
        {/* New ^^ Old vv */}
        <Navbar sticky='top' expand='lg' className='pantry-nav' >
            <div className='navbar-left'>
                <NavLink to='/' style={({ isActive }) => isActive ? { color: '#C0563E'} : { color: 'black'}} className='navbar-brand'>
                    Pantry
                </NavLink>
                <NavLink to='/' className={({ isActive, isPending }) => isPending ? "pending"  : isActive ? "active" : "" }>
                        Recipes
                </NavLink>
                <NavLink to='/search' className={({ isActive, isPending }) => isPending ? "pending"  : isActive ? "active" : "" }>
                        Search
                </NavLink>
                <NavLink to='/about' className={({ isActive, isPending }) => isPending ? "pending"  : isActive ? "active" : "" }>
                        About
                </NavLink>
            </div>
            <div className='navbar-right'>
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
                        <Col md='auto' className='d-flex align-items-center pantry-heading-user'>
                            <PersonCircle color='black' className='pantry-heading-profile-icon' onClick={() => navigate(`/user/${username}`)} />
                            <NavDropdown title={username} className='pantry-heading' >
                                <NavDropdown.Item as={Link} to={`/user/${username}`} className='pantry-heading'>{username}</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to={'/search'} reloadDocument className='pantry-heading'>Search</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to={'/new-recipe'} className='pantry-heading'>New Recipe</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleOpenNewPantryItem} className='pantry-heading'>New Pantry Item</NavDropdown.Item>
                                <NavDropdown.Item onClick={logout} className='pantry-heading'>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Col>
                    )}
            </div>
        </Navbar>
        <NewPantryItem openNewPantryItem={openNewPantryItem} setOpenNewPantryItem={setOpenNewPantryItem} />
        </>
    )
}