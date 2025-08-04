import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup } from 'react-bootstrap';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

export default function Login() {

    return (
        <div className='app'>
            <Header />
            <Container className='my-auto' fluid>
                <Form className='w-25 p-3 mx-auto border border-primary-subtle rounded'>
                    <h3 className='text-center m-2'>Log in to Pantry</h3>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formUsername' label='Username'>
                                    <Form.Control type='text' placeholder='Username' />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formPassword' label='Password'>
                                    <Form.Control type='password' placeholder='password' />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row className='justify-content-md-center'>
                            {/* <Col className='m-2'> */}
                                <Button className='w-50 m-2' type='submit'>Log in</Button>
                            {/* </Col> */}
                        </Row>
                        <Row>
                            <Col className='m-2 text-center'>
                                <p>New to Pantry? <Link to='/sign-up'>Sign up for free!</Link></p>
                            </Col>
                        </Row>
                </Form>
            </Container>
        </div>
    )
}