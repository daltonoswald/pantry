import Header from '../../components/header/Header';
import PageTitle from '../../components/PageTitle';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import './profilePantry.styles.css';

const PAGE_SIZE = 16;

export default function ProfilePantry() {
    const { username } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Math.max(parseInt(searchParams.get('page')) || 1, 1);
    const { token } = useAuth();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const url = `http://localhost:3000/pantry/by-user/${encodeURIComponent(username)}?page=${page}&limit=${PAGE_SIZE}`;

        const getPantry = async() => {
            setIsLoading(true);
            setError(null);
            setData(null);

            try {
                const response = await fetch(url, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                const result = await response.json();
                if (!response.ok) {
                    setError({ status: response.status, text: result.error || 'Somethign went wrong. Please try again.' });
                } else {
                    setData(result);
                    console.log(result);
                }
            } catch (err) {
                if (err.name === 'AbortError') return;
                setError({ status: 0, text: 'Could not reach the server. Please try again.' });
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        };

        getPantry();
        return () => controller.abort();
    }, [username, page, token]);

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
                        {`'s Pantry`}({data.total})
                    </h2>
                </div>
            )}
        </div>
    )
}