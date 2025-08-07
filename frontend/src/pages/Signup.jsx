import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup } from 'react-bootstrap';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

export default function Signup() {

    return (
        <div className='app'>
            <Header />
            <Container className='my-auto' fluid>
                <Form className='w-25 p-3 mx-auto border border-primary-subtle rounded'>
                    <h3 className='text-center m-2'>Create a new Pantry account</h3>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formUsername' label='Username'>
                                    <Form.Control type='text' placeholder='Username' />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formName' label='Name'>
                                    <Form.Control type='text' placeholder='Name' />
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
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formConfirmPassword' label='Confirm Password'>
                                    <Form.Control type='password' placeholder='password' />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formConfirmPassword' label='Bio'>
                                    <Form.Control type='text' as='textarea' rows={3} placeholder='Bio' style={{ height: 'unset'}} />
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
                                <p>Returning to Pantry? <Link to='/login'>Log in</Link></p>
                            </Col>
                        </Row>
                </Form>
            </Container>
        </div>
    )
}