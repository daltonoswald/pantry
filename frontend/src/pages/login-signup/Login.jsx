import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert } from 'react-bootstrap';
import Header from '../../components/header/Header';
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
        console.log('data:', loginData)
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
            <div className='login-container'>
                <div className='login-column-left'>
                    <img className='login-image' src={vegetablesImg} />
                </div>
                <div className='login-column-right'>
                    <form className='login-form' onSubmit={handleSubmit}>
                        <h3 className='login-brand'>Welcome Back</h3>
                        <div className='form-group'>
                            <label htmlFor='username' className='form-label'>Username</label>
                            <input
                                type='text'
                                id='username'
                                name='username'
                                placeholder='Username'
                                className='form-input'
                                required />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='password' className='form-label'>Password</label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                minLength={8}
                                className='form-input'
                                required />
                        </div>
                        <div className='form-group'>
                            <button className='submit-button' type='submit'>Log in</button>
                        </div>
                        <p className='sign-up-login-link'>New to Pantry? <Link to='/sign-up'>Sign up</Link></p>
                    </form>
                </div>
            </div>
            {/* <Container className='my-auto w-75 flex-grow-1' fluid>
                <Row className='login-container'>
                    <Col md={6} className='login-column-left'>
                        <img className='login-image' src={vegetablesImg} />
                    </Col>
                    <Col md={6} className='login-column-right'>
                        <Form className='mx-4' onSubmit={handleSubmit}>
                            <h3 className='text-center m-2 login-brand'>Welcome Back</h3>
                                <Form.Group className='my-4' controlId='formUsername'>
                                    <Form.Label>USERNAME</Form.Label>
                                    <Form.Control name='username' placeholder='Username'></Form.Control>
                                </Form.Group>
                                <Form.Group className='my-4' controlId='formPassword'>
                                    <Form.Label>PASSWORD</Form.Label>
                                    <Form.Control name='password' type='password' ></Form.Control>
                                </Form.Group>
                                <Row className='my-4 justify-content-md-center'>
                                    <Button className='w-75 m-2 submit-button' type='submit'>Log in</Button>
                                </Row>
                                <Row>
                                    <Col className='m-2 text-center'>
                                        <p>New to Pantry? <Link to='/sign-up'>Sign Up</Link></p>
                                    </Col>
                                </Row>
                        </Form>
                        {message && (
                            <Alert className='w-50 m-3 p-3 mx-auto' variant='danger'>{message}</Alert>
                        )}  
                    </Col>          
                </Row>
            </Container> */}
        </div>
    )
}