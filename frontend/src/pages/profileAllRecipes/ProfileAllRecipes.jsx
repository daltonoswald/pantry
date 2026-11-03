import Header from '../../components/header/Header';
import PageTitle from '../../components/PageTitle';
import MediumRecipeCard from '../../components/recipe-cards/MediumRecipeCard';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import './profileAllRecipes.styles.css';

const PAGE_SIZE = 0;


export default function ProfileAllRecipes() {
    const { username } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Math.max(parseInt(searchParams.get('page')) || 1, 1);
    const { token } = useAuth();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = `http://localhost:3000/recipe/by-user/${encodeURIComponent(username)}?page=${page}&limit=${PAGE_SIZE}`;

    useEffect(() => {
        const controller = new AbortController();

        const getRecipes = async () => {
            setIsLoading(true);
            setError(null);
            setData(null);

            try {
                const response = await fetch(url, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    signal: controller.signal,
                });
                const result = await response.json();
                if (!response.ok) {
                    setError({ status: response.status, text: result.error || 'Something went wrong. Please try again.' });
                } else {
                    setData(result);
                }
            } catch (err) {
                if (err.name === 'AbortError') return;
                setError({ status: 0, text: 'Could not reach the server. Please try again.'})
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        };

        getRecipes();
        return () => controller.abort();
    }, [username, page, token, url]);

    const goToPage = (n) => {
        setSearchParams({ page: n });
        window.scrollTo({ top: 0 });
    };

    const displayName = data?.user.username ?? username;
    const title = `${displayName}'s recipes${page > 1 ? ` (page ${page})` : ''}`;

    return (
        <div className='app'>
            <PageTitle title={title} />
            <Header />

            {isLoading && (
                <div className='spinner-container'><div className='loading-spinner'></div></div>
            )}

            {!isLoading && error && (
                <div className='recipe-error'>
                    <h2>{error.status === 404 ? 'User not found' : 'Something went wrong.'}</h2>
                    <p>{error.text}</p>
                    <Link to='/'>Back to home</Link>
                </div>
            )}

            {!isLoading && data && (
                <div className='all-recipes-page'>
                    <h2>
                        <Link to={`/user/${data.user.username}`}>{data.user.username}</Link>
                        {' '}({data.total})
                    </h2>

                    {data.recipes.length === 0 ? (
                        <p>
                            {data.total === 0
                                ? 'No recipes yet...'
                                : <>No recipes on this page. <Link to='?page=1'>Go to the first page</Link></>}
                        </p>
                    ) : (
                        <div className='recipe-grid'>
                            {data.recipes.map(recipe => (
                                <MediumRecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                        </div>
                    )}

                    {data.totalPages > 1 && (
                        <nav className='pagination' aria-label='Pagination'>
                            <button onClick={() => goToPage(page - 1)} disabled={page <= 1}>Previous</button>
                            <span>Page {page} of {data.totalPages}</span>
                            <button onClick={() => goToPage(page + 1)} disabled={page >= data.totalPages}>Next</button>
                        </nav>
                    )}
                </div>
            )}
        </div>
    )
}