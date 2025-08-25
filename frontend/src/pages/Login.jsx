import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
            <Container className='my-auto' fluid>
                <Form className='w-25 p-3 mx-auto border border-primary-subtle rounded' onSubmit={handleSubmit}>
                    <h3 className='text-center m-2'>Log in to Pantry</h3>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formUsername' label='Username'>
                                    <Form.Control name='username' type='text' placeholder='Username' />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='m-2'>
                                <FloatingLabel controlId='formPassword' label='Password'>
                                    <Form.Control name='password' type='password' placeholder='password' />
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
                {message && (
                    <Alert className='w-25 m-3 p-3 mx-auto' variant='danger'>{message}</Alert>
                )}
            </Container>
        </div>
    )
}