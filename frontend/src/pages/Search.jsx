import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Search() {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const [searchResults, setSearchResults] = useState(null);
    const token = localStorage.getItem('pantryAuthToken');
    const [searchParams] = useSearchParams();
    console.log(searchParams);

    return (
        <div className='app'>
            <Header />
            <Container className='my-auto' fluid>
                <h1>{searchParams}</h1>
            </Container>
        </div>
    )
}