import Header from '../../components/header/Header';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdArrowDropDown, MdOutlineSearch } from 'react-icons/md'
import SearchIngredients from './searchComponents/SearchIngredients';
import SearchRecipes from './searchComponents/SearchRecipes';
import SearchUsers from './searchComponents/SearchUsers';
import SearchTags from './searchComponents/SearchTags';
import './search.styles.css';
import { BiSlider } from 'react-icons/bi';

export default function Search() {
    const navigate = useNavigate();
    const [userStats, setUserStats] = useState(null)
    const [message, setMessage] = useState();
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('pantryAuthToken');
    const [searchParams] = useSearchParams();
    let searchQuery = searchParams.get('q');
    let searchType = searchParams.get('t');

    const fetchUserStats = async () => {
        const url = `http://localhost:3000/user/stats`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          mode: 'cors'
        });
        const data = await response.json();
        console.log('userStats: ', data)
        if (response.ok) {
          setUserStats({
            pantryItems: data.stats.pantryItems.length,
            recipes: data.stats._count.recipes,
            favorites: data.stats._count.recipeFavorites,
            followers: data.stats._count.followedBy
          });
        }
    }

    useEffect(() => {
        if (token) fetchUserStats();
    }, [token]);

    const handleSearch = async (e) => {
        if (e) {
            e.preventDefault();
            searchQuery = e.target.query.value;
            searchType = e.target.type.value
        }
        window.history.replaceState(null, '', `search?q=${searchQuery}&t=${searchType}`)
        const url = `http://localhost:3000/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`
        // const url = `http://localhost:3000/search?query=meat&type=all`
        try {
            // fetchUserStats();
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
            <div className='search-container'>
                <div className='search-bar-container'>
                    <h3 className='search-title'>Search the Pantry Archives</h3>
                    <p>Browse recipes, seasonal ingredients, tags, and member profiles.</p>
                    <form className='search-form' onSubmit={handleSearch}>
                        <div className='search-form-group-select'>
                            <BiSlider />
                            <select
                                name='type'
                                aria-label='search-type'
                                defaultValue={searchType ? searchType : 'All'}
                                className='search-bar-type'>
                                    <option value='all'>All</option>
                                    <option value='recipes'>Recipes</option>
                                    <option value='ingredients'>Ingredients</option>
                                    <option value='tags'>Tags</option>
                                    <option value='users'>Users</option>
                            </select>
                            {/* <MdArrowDropDown color='black' /> */}
                        </div>
                        <div className='search-form-group-input'>
                            <MdOutlineSearch color='black' />
                            <input  
                                type='text'
                                id='query'
                                name='query'
                                placeholder='Search...'
                                aria-label='Search'
                                defaultValue={searchQuery ? searchQuery: ''}
                                required
                                className='search-bar-query'
                            />
                        </div>
                        <div className='search-form-group-submit'>
                            <button className='submit-button' type='submit'><MdOutlineSearch color='white' /> Search</button>
                        </div>
                    </form>
                </div>
                {(searchResults?.results.recipes) && (
                    <div className='search-recipes-container'>
                        {(searchResults.results.recipes.map(recipe => (
                            <SearchRecipes key={recipe.id} recipe={recipe} userStats={userStats} />
                        )))}
                    </div>
                )}
            </div>
            {/* <Container className='my-auto main-content' fluid>
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
                <Row className='mb-4'>
                    {(searchResults?.results.tags) && (
                        searchResults?.results.tags.map(tag => (
                            <>
                            <h1>{tag.name}</h1>
                            {tag.recipes.map(recipe => (
                                <Col md={4} className='p-2'  >
                                    <SearchTags key={recipe.id} recipe={recipe} />
                                </Col>
                            ))}
                            </>
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
            </Container> */}
        </div>
    )
}