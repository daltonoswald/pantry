import Header from '../../components/header/Header';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdArrowDropDown, MdOutlineSearch } from 'react-icons/md'
import SearchIngredientCard from './searchComponents/SearchIngredientCard';
import SearchUsers from './searchComponents/SearchUsers';
import SearchTags from './searchComponents/SearchTags';
import './search.styles.css';
import { BiSlider } from 'react-icons/bi';
import MediumRecipeCard from '../../components/recipe-cards/MediumRecipeCard';
import { useAuth } from '../../context/AuthContext';
import PageTitle from '../../components/PageTitle';

export default function Search() {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q');
    const searchType = searchParams.get('t');
    const { token } = useAuth();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?q=${encodeURIComponent(e.target.query.value)}&t=${e.target.type.value}`);
    }

    const runSearch = async () => {
        const url = `http://localhost:3000/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`
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
        if (searchQuery && searchType) runSearch();
        else setIsLoading(false)
    }, [searchParams])

    if (!isLoading) return (
        <div className='app'>
            <PageTitle title={searchQuery ? `Search: ${searchQuery}` : 'Search' } />
            <Header />
            <div className='search-container'>
                <div className='search-bar-container'>
                    <h3 className='search-title'>Search the Pantry Archives</h3>
                    <p>Browse recipes, seasonal ingredients, tags, and member profiles.</p>
                    <form className='search-form' onSubmit={handleSearch}>
                        <div className='search-form-group-select'>
                            <BiSlider />
                            <select
                                key={searchType}
                                name='type'
                                aria-label='search-type'
                                defaultValue={searchType || 'all'}
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
                                key={searchQuery}
                                type='text'
                                id='query'
                                name='query'
                                placeholder='Search...'
                                aria-label='Search'
                                defaultValue={searchQuery || ''}
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
                            <MediumRecipeCard recipe={recipe}  />
                        )))}
                    </div>
                )}
                {(searchResults?.results.ingredients) && (
                    <div className='search-ingredients-container'>
                        {(searchResults.results.ingredients.map(ingredient => (
                            <SearchIngredientCard key={ingredient.id} ingredient={ingredient}  />
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