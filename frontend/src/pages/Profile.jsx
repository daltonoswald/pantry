import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Profile() {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [profisleData, setProfileData] = useState();
    const token = localStorage.getItem('pantryAuthToken');
    const params = useParams();

    useEffect(() => {
        const getProfile = async () => {
            const url = `http://localhost:3000/user/profile/${params.username}`;
            // if (!token) {
            //     navigate('/')
            // }
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
                    setMessage(errorData);
                }
                if (response.ok) {
                    const profileData = await response.json();
                    setProfileData(profileData.user);
                    setMessage(null);
                    setIsLoading(false)
                }
            } catch (error) {
                console.error(`Errors: ${error}`);
                setMessage(error);
            }
        }
        getProfile();
    }, [params.username, navigate, token]);

    if (isLoading) {
        return (
            <div className='app'>
                <Header />
                <p>Loading...</p>
            </div>
        )
    }


    if (!isLoading) {
        return (
            <div className='app'>
                <Header />
            </div>
        )
    }
}