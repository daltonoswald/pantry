import { Container, Row, Col, Form, FloatingLabel, Button, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Signup() {
    const navigate = useNavigate();
    const [message, setMessage] = useState();

    useEffect(() => {
        if (localStorage.getItem('pantryAuthToken')) {
            navigate('/')
        }
    })

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = `http://localhost:3000/user/sign-up`;
        const signupData = {
            name: event.target.name.value,
            username: event.target.username.value,
            password: event.target.password.value,
            confirm_password: event.target.confirm_password.value,
            bio: event.target.password.value,
        }
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signupData),
                mode: "cors",
            });
            const data = await response.json();

            if (response.ok) {
                console.log(data);
                setMessage(data.message);
                navigate('/login')
            } else {
                console.error("Error requesting authentication:", data.message);
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error requesting authentication:', error)
            setMessage(error)
        }
    }

    return (
        <div className='app'>
            <Header />
            <Container className='my-auto' fluid>
                <Form className='w-25 p-3 mx-auto border border-primary-subtle rounded' onSubmit={handleSubmit}>
                    <h3 className='text-center m-2'>Create a new Pantry account</h3>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formUsername' label='Username'>
                                    <Form.Control name='username' type='text' placeholder='Username' required />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formName' label='Name'>
                                    <Form.Control name='name' type='text' placeholder='Name' required />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formPassword' label='Password'>
                                    <Form.Control name='password' type='password' placeholder='password' required minLength={8} maxLength={50} />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formConfirmPassword' label='Confirm Password'>
                                    <Form.Control name='confirm_password' type='password' placeholder='password' required minLength={8} maxLength={50} />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formBio' label='Bio'>
                                    <Form.Control name='bio' type='text' as='textarea' rows={3} placeholder='Bio' style={{ height: 'unset'}} />
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
                {message && (
                    <Alert className='w-25 m-3 p-3 mx-auto' variant='danger'>{message}</Alert>
                )}
            </Container>
        </div>
    )
}