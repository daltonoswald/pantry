import { Col, Container, Nav, Navbar, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Header() {
    const token = localStorage.getItem('pantryToken');

    return (
        <Navbar expand='lg' className='bg-body-tertiary mb-3' data-bs-theme='dark'>
            <Container>
                <Navbar.Brand as={Link} to='/'>Pantry</Navbar.Brand>
                {!token && (
                    <Row className='text-light'>
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
                    </Row>
                )}
            </Container>
        </Navbar>
    )
}