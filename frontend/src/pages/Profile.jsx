import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { Trash, PersonSquare } from 'react-bootstrap-icons';
import Header from '../components/Header';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ErrorModal from '../components/ErrorModal';
import { capFirst, handleDeleteFromPantry } from '../utils/utility';
import ProfilePantry from '../components/profile/ProfilePantry';
import ProfileRecipes from '../components/profile/ProfileRecipes';

export default function Profile() {
    const navigate = useNavigate();
    const [myData, setMyData] = useState();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState();
    const token = localStorage.getItem('pantryAuthToken');
    const params = useParams();

    useEffect(() => {
        const getProfile = async () => {
            const url = `http://localhost:3000/user/profile/${params.username}`;
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
                    console.log('errorData41', errorData.error.message)
                    setMessage(errorData.error.message);
                } else {
                    const profileData = await response.json();
                    // console.log(profileData.user.user);
                    console.log(profileData.profile);
                    setProfileData(profileData.profile);
                    setMyData(profileData.user.user)
                    setMessage(null);
                    setIsLoading(false)
                }
            } catch (error) {
                console.error(`Errors: ${error.error.message}`);
                console.log('catch');
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
        console.log(message)
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
                <Container>
                    <Row className='profile-header'>
                        <Col>
                            <Col className='profile-header-left'>
                                <Row className='profile-info'>
                                    <Col className='profile-picture'>
                                        <PersonSquare />
                                    </Col>
                                    <Col className='profile-names'>
                                        <h1>{profileData.username}</h1>
                                        <h2>{profileData.name}</h2>
                                    </Col>
                                </Row>
                                <Row className='profile-follows'>
                                    <Col>
                                        <p>{profileData._count.following} Following</p>
                                    </Col>
                                    <Col>
                                        <p>{profileData._count.followedBy} Followers</p>
                                    </Col>
                                </Row>
                            </Col>
                        </Col>
                        <Col>
                            <p>{profileData.bio}</p>
                        </Col>
                        <Col>
                            <Col>
                                <p>{profileData.recipes.length} Recipes</p>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ProfilePantry myData={myData} profileData={profileData} isLoading={isLoading} />
                        </Col>
                        <Col>
                            <ProfileRecipes myData={myData} profileData={profileData} />
                        </Col> 
                    </Row>
                </Container>
            </div>
        )
    }
}