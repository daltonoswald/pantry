import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Search() {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const token = localStorage.getItem('pantryAuthToken');
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('q');

    const handleSearch = async (e) => {
        e.preventDefault();
        const url = `http://localhost:3000/search`
        const formData = {
            searchValue: e.target.search.value
        }
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                mode: "cors"
            });
            const data = await response.json()
            if (response.ok) {
                console.log(data);
            }
        } catch (error) {
            console.error(`Error Requesting authentication:`, error);
            console.log(error)
        }
    }

    return (
        <div className='app'>
            <Header />
            <Container className='my-auto' fluid>
                <Form className='p-3' onSubmit={handleSearch}>
                    <Row>
                        <InputGroup className='w-50 mx-auto'>
                            <FloatingLabel controlId='search' label='Search'>
                                <Form.Control 
                                    name='search' 
                                    type='text' 
                                    placeholder='Search' 
                                    defaultValue={searchTerm ? searchTerm : ''} 
                                    />
                            </FloatingLabel>
                            <Button className='m-2' type='submit'>Search</Button>
                        </InputGroup>
                    </Row>
                </Form>
            </Container>
        </div>
    )
}