import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert } from 'react-bootstrap';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import vegetablesImg from '../../assets/temp-stock-photos/vegetables.jpg'
import './login-signup.css'

export default function Login() {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const token = localStorage.getItem('pantryAuthToken')

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    })

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = `http://localhost:3000/user/log-in`
        const loginData = {
            username: event.target.username.value,
            password: event.target.password.value
        }
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
                mode: "cors",
            });
            const data = await response.json();

            if (response.ok) {
                console.log(data);
                localStorage.setItem('pantryAuthToken', data.token);
                localStorage.setItem('pantryUsername', data.user.username);
                navigate('/')
            } else {
                console.error("Error requesting authentication:", data.message);
                setMessage(data.message)
                console.log(data.message);
            }
        } catch (error) {
            console.error('Error requesting authentication:', error)
            console.log(error)
        }
    }

    return (
        <div className='app'>
            <Header />
            <Container className='my-auto w-75 flex-grow-1' fluid>
                <Row className='login-container my-auto'>
                    <Col md={6} className='login-column-left'>
                        <img className='login-image' src={vegetablesImg} />
                    </Col>
                    <Col md={6} className='login-column-right'>
                        <Form className='mx-4' onSubmit={handleSubmit}>
                            <h3 className='text-center m-2 login-brand'>Welcome Back</h3>
                                <Form.Group className='my-4' controlId='formUsername'>
                                    <Form.Label>USERNAME</Form.Label>
                                    <Form.Control placeholder='Username'></Form.Control>
                                </Form.Group>
                                <Form.Group className='my-4' controlId='formPassword'>
                                    <Form.Label>PASSWORD</Form.Label>
                                    <Form.Control name='password' type='password' placeholder='*********'></Form.Control>
                                </Form.Group>
                                <Row className='my-4 justify-content-md-center'>
                                    <Button className='w-75 m-2 submit-button' type='submit'>Create Account</Button>
                                </Row>
                                <Row>
                                    <Col className='m-2 text-center'>
                                        <p>New to Pantry? <Link to='/sign-up'>Sign Up</Link></p>
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