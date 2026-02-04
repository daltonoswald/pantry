import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert } from 'react-bootstrap';
import Header from '../../components/Header';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchIngredients from './searchComponents/SearchIngredients';
import SearchRecipes from './searchComponents/SearchRecipes';
import SearchUsers from './searchComponents/SearchUsers';

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
        if (e) {
            e.preventDefault();
            searchQuery = e.target.query.value;
            searchType = e.target.type.value
        }
        window.history.replaceState(null, '', `search?q=${searchQuery}&t=${searchType}`)
        const url = `http://localhost:3000/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`
        // const url = `http://localhost:3000/search?query=meat&type=all`
        console.log('here');
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

    useEffect(() => {
        if (searchQuery && searchType) {
            handleSearch();
        } else {
            setIsLoading(false)
            return
        }
    }, [searchParams])

    if (!isLoading) return (
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
                                    required
                                    />
                            </FloatingLabel>
                            <Form.Select name='type' aria-label='search-type' defaultValue={searchType ? searchType: 'All'}>
                                <option value='all'>All</option>
                                <option value='recipes'>Recipes</option>
                                <option value='ingredients'>Ingredients</option>
                                <option value='tags'>Tags</option>
                                <option value='users'>Users</option>
                            </Form.Select>
                            <Button className='' type='submit'>Search</Button>
                        </InputGroup>
                    </Row>
                </Form>
                <Row className='mb-4'>
                    {(searchResults?.results.ingredients) && (
                        searchResults.results.ingredients.map(ingredient => (
                            <Col md={3} className='p-2' >
                                <SearchIngredients key={ingredient.id} ingredient={ingredient} />
                            </Col>
                        ))
                    )}
                </Row>
                <Row className='mb-4'>
                    {(searchResults?.results.recipes) && (
                        searchResults.results.recipes.map(recipe => (
                            <Col md={4} className='p-2' >
                                <SearchRecipes key={recipe.id} recipe={recipe} />
                            </Col>
                        ))
                    )}
                </Row>
                <Row className='mb-4' >
                    {(searchResults?.results.users) && (
                        searchResults.results.users.map(user => (
                            <Col md={4} className='p-2'  >
                                <SearchUsers key={user.id} user={user} />
                            </Col>
                        ))
                    )}
                </Row>
                <Row>
                    {(searchResults?.totals) && (
                        <Col>
                            <p className='text-muted'>{searchResults.totals.total} results</p>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    )
}