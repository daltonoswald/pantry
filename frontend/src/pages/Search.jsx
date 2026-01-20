import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Search() {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('pantryAuthToken');
    const [searchParams] = useSearchParams();
    let searchQuery = searchParams.get('q');
    let searchType = searchParams.get('t');

    const handleSearch = async (e) => {
        e.preventDefault();
        searchQuery = e.target.query.value;
        searchType = e.target.type.value
        window.history.replaceState(null, '', `search?q=${searchQuery}&t=${searchType}`)
        const url = `http://localhost:3000/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`
        // const url = `http://localhost:3000/search?query=meat&type=all`
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                mode: "cors"
            });
            const data = await response.json()
            if (response.ok) {
                window.history.replaceState(null, '', `search?q=${searchQuery}&t=${searchType}`)
                console.log(searchQuery, searchType);
                console.log(data);
                setSearchResults(data)
            }
        } catch (error) {
            console.error(`Error Requesting authentication:`, error);
            console.log(error)
        } finally {
            setIsLoading(false);
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
                                <option value='recipes'>Recipes</option>
                                <option value='ingredients'>Ingredients</option>
                                <option value='tags'>Tags</option>
                                <option value='users'>Users</option>
                            </Form.Select>
                            <Button className='m-2' type='submit'>Search</Button>
                        </InputGroup>
                    </Row>
                </Form>
            </Container>
        </div>
    )
}