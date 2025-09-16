import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert, Spinner } from 'react-bootstrap';
import Header from '../components/Header';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ErrorModal from '../components/ErrorModal';

export default function Profile() {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState();
    const token = localStorage.getItem('pantryAuthToken');
    const params = useParams();

    useEffect(() => {
        const getProfile = async () => {
            const url = `http://localhost:3000/user/profile/${params.username}`;
            // if (!token) {
            //     navigate('/')
            // }
            console.log(params.username);
            const userToFind = {
                userToFind: params.username
            }
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(userToFind),
                    mode: 'cors'
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    setIsLoading(false);
                    console.error(`Error Data: `, errorData.error);
                    console.log('errorData41', errorData.error)
                    setMessage(errorData);
                }
                if (response.ok) {
                    const profileData = await response.json();
                    console.log(profileData.user.user);
                    setProfileData(profileData.user.user);
                    setMessage(null);
                    setIsLoading(false)
                }
            } catch (error) {
                console.error(`Errors: ${error}`);
                setMessage(error);
            }
        }
        getProfile();
    }, [params.username, navigate]);

    if (isLoading) {
        return (
            <div className='app'>
                <Header />
                <Spinner />
                <p>Loading...</p>
            </div>
        )
    }

    if (!isLoading && message) {
        console.log(message.error.message)
        return (
            <div className='app'>
                <Header />
                <ErrorModal error={message} />
            </div>
        )
    }


    if (!isLoading && !message) {
        return (
            <div className='app'>
                <Header />
                <Row>
                    <Col>
                        <h1>{profileData.username}</h1>
                        <p>{profileData.bio}</p>
                    </Col>
                    <Col>
                        <Row>
                            <h1>{profileData.username}'s Recipes</h1>
                            <Container>
                                
                            </Container>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}