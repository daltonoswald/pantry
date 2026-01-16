import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Search() {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const token = localStorage.getItem('pantryAuthToken');
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q');
    const searchType = searchParams.get('t');
    console.log(`Query: ${searchQuery}, Type: ${searchType}`)

    const handleSearch = async (e) => {
        e.preventDefault();
        const url = `http://localhost:3000/search`
        const formData = {
            searchQuery: e.target.query.value,
            searchType: e.target.type.value
        }
        console.log(formData);
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
                window.history.replaceState(null, '', `/search/?q=${searchQuery}&t=${searchType}`)
                // navigate(`/search/?q=${searchQuery}&t=${searchType}`)
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
                            <FloatingLabel controlId='query' label='Search'>
                                <Form.Control 
                                    name='query' 
                                    type='text' 
                                    placeholder='Search' 
                                    defaultValue={searchQuery ? searchQuery: ''} 
                                    />
                            </FloatingLabel>
                            <Form.Select name='type' aria-label='search-type' defaultValue={searchType ? searchType: 'All'}>
                                <option value='all'>All</option>
                                <option value='recipe'>Recipe</option>
                                <option value='incredient'>Ingredient</option>
                                <option value='tag'>Tag</option>
                                <option value='user'>User</option>
                            </Form.Select>
                            <Button className='m-2' type='submit'>Search</Button>
                        </InputGroup>
                    </Row>
                </Form>
            </Container>
        </div>
    )
}