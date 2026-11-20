import Header from '../../components/header/Header';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdOutlineSearch } from 'react-icons/md'
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

    useEffect(() => {
        if (!searchQuery || !searchType) {
            setIsLoading(false);
            return;
        }
        const controller = new AbortController();

        const runSearch = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    mode: "cors",
                    signal: controller.signal,
                });
                const data = await response.json()
                if (response.ok) {
                    setSearchResults(data)
                }
            } catch (error) {
                if (error.name !== 'AbortError') console.error(`Search failed:`, error);
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        };

        runSearch();
        return () => controller.abort();
    }, [searchQuery, searchType, token])

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
        </div>
    )
}