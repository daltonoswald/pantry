import { Container, Row, Col, Form, FloatingLabel, Button, Alert } from 'react-bootstrap';
import Header from '../../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import doughImg from '../../assets/temp-stock-photos/dough.jpg'
import './login-signup.css'

export default function Signup() {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    // document.title = 'Pantry - Sign Up'

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
            email: event.target.email.value,
            password: event.target.password.value,
            confirm_password: event.target.confirm_password.value,
            bio: event.target.bio.value,
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
            <Container className='my-auto w-75' fluid>
                <Row className='signup-container'>
                    <Col md={6} className='signup-column-left' >
                        <img className='signup-image' src={doughImg} />
                    </Col>
                    <Col md={6} className='signup-column-right'>
                        <Form className='mx-4' onSubmit={handleSubmit}>
                            <h3 className='text-center m-2 signup-brand'>Pantry</h3>
                                <Form.Group className='my-4' controlId='formUsername'>
                                    <Form.Label>USERNAME</Form.Label>
                                    <Form.Control placeholder='Username'></Form.Control>
                                </Form.Group>
                                <Form.Group className='my-4' controlId='formEmail'>
                                    <Form.Label>E-Mail</Form.Label>
                                    <Form.Control placeholder='example@email.com'></Form.Control>
                                </Form.Group>
                                <Form.Group className='my-4' controlId='formName'>
                                    <Form.Label>FULL NAME</Form.Label>
                                    <Form.Control placeholder='FULL NAME'></Form.Control>
                                </Form.Group>
                                <Form.Group className='my-4' controlId='formPassword'>
                                    <Form.Label>PASSWORD</Form.Label>
                                    <Form.Control name='password' type='password' placeholder='*********' required minLength={8} maxLength={50} ></Form.Control>
                                </Form.Group>
                                <Form.Group className='my-4' controlId='formConfirmPassword'>
                                    <Form.Label>CONFIRM PASSWORD</Form.Label>
                                    <Form.Control name='confirm_password' type='password' placeholder='*********' required minLength={8} maxLength={50} ></Form.Control>
                                </Form.Group>
                                <Form.Group className='my-4' controlId='formBio'>
                                    <Form.Label>BIO</Form.Label>
                                    <Form.Control type='text' as='textarea' rows={3} placeholder='BIO' style={{ height: 'unset'}} ></Form.Control>
                                </Form.Group>
                                <Row className='my-4 justify-content-md-center'>
                                    <Button className='w-75 m-2 submit-button' type='submit'>Create Account</Button>
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
                    </Col>
                </Row>
            </Container>
        </div>
    )
}