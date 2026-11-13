import Header from '../../components/header/Header';
import PageTitle from '../../components/PageTitle';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState, useRef } from 'react';
import './profileAllPantry.styles.css';
import PantryItemCard from './PantryItemCard';

const PAGE_SIZE = 16;

export default function ProfilePantry() {
    const { username } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Math.max(parseInt(searchParams.get('page')) || 1, 1);
    const { token } = useAuth();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [removedCount, setRemovedCount] = useState(0);
    const refreshInBackground = useRef(false);

    useEffect(() => {
        setRemovedCount(0);
    }, [data]);

    const handleRemoved = () => {
        const nowRemoved = removedCount + 1;
        refreshInBackground.current = true;
        setRemovedCount(nowRemoved);
        setReloadKey(key => key + 1)
        // if nothing left on current page, pull in the next item(s)
        // if (nowRemoved === data.items.length) {
        //     if (page > 1) goToPage(page - 1);
        //     else setReloadKey(key => key + 1);
        // }
    }

    useEffect(() => {
        const controller = new AbortController();
        const url = `http://localhost:3000/pantry/by-user/${encodeURIComponent(username)}?page=${page}&limit=${PAGE_SIZE}`;

        const background = refreshInBackground.current;
        refreshInBackground.current = false;

        const getPantry = async() => {
            let redirected = false;

            if (!background) {
                setIsLoading(true);
                setError(null);
                setData(null);
            }

            try {
                const response = await fetch(url, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    signal: controller.signal,
                });
                const result = await response.json();
                if (!response.ok) {
                    if (!background) setError({ status: response.status, text: result.error || 'Something went wrong. Please try again.' });
                } else if (result.items.length === 0 && result.totalPages > 0 && page > result.totalPages) {
                    redirected = true
                    setSearchParams({ page: result.totalPages } , { replace: true });
                } else {
                    setData(result);
                }
            } catch (err) {
                if (err.name === 'AbortError') return;
                setError({ status: 0, text: 'Could not reach the server. Please try again.' });
            } finally {
                if (!controller.signal.aborted && !background && !redirected) setIsLoading(false);
            }
        };

        getPantry();
        return () => controller.abort();
    }, [username, page, token, reloadKey]);

    const goToPage = (n) => {
        setSearchParams({ page: n });
        window.scrollTo({ top: 0 });
    };

    const displayName = data?.user.username ?? username;
    const title = `${displayName}'s pantry${(page > 1 ? ` (page ${page})` : '')}`;

    return (
        <div className='app'>
            <PageTitle title={title} />
            <Header />

            {isLoading && (
                <div className='spinner-container'><div className='loading-spinner'></div></div>
            )}

            {!isLoading && error && (
                <div className='profile-pantry-error'>
                    <h2>{error.status === 404 ? 'User not found.' : 'Something went wrong.'}</h2>
                    <p>{error.text}</p>
                    <p>Return to <Link to={`/user/${username}`}>{username}</Link>{`'s Profile.`}</p>
                    <Link to='/'>Back to home</Link>
                </div>
            )}

            {!isLoading && data && (
                <div className='profile-pantry-page'>
                    <h2 className='profile-pantry-title'>
                        <Link to={`/user/${data.user.username}`}>{data.user.username}</Link>
                        {`'s Pantry `}({data.total - removedCount})
                    </h2>

                    {data.items.length === 0 ? (
                        <p>
                            {data.total === 0
                                ? 'No pantry items yet...'
                                : <>No pantry items on this page. <Link to='?page=1'>Go to the first page.</Link></>
                            }
                        </p>
                    ) : (
                        <div className='profile-pantry-grid'>
                            {data.items.map(item => (
                                <PantryItemCard
                                    key={item.id}
                                    item={item}
                                    isOwnProfile={data.isOwnProfile}
                                    onRemoved={handleRemoved}
                                />
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
    );
}