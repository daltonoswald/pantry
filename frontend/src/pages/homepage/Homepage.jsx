import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header';
import Recommendations from './Recommendations';
import { useState, useEffect } from 'react';

export default function Homepage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('pantryAuthToken');
  const username = localStorage.getItem('pantryUsername');
  const [isLoading, setIsLoading] = useState(true);
  const [makeableRecipes, setMakeableRecipes] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [userStats, setUserStats] = useState(null);
  // const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch different data based on login status
        if (token) {
          // Logged in: fetched personalized data
          await Promise.all([
            fetchMakeableRecipes(),
            fetchUserStats(),
            fetchTrendingRecipes(),
            fetchPopularTags()
          ]);
        } else {
          // Not logged in
          await Promise.all([
            fetchTrendingRecipes(),
            fetchRecentRecipes(),
            fetchPopularTags()
          ]);
        }
      } catch (error) {
        console.error('Error fetchign homepage data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, [token])
  
  const fetchMakeableRecipes = async () => {
      const url = `http://localhost:3000/recipe/makeable`
      try {
          const response = await fetch(url, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
              },
              mode: 'cors'
          });
  
          const data = await response.json();
          console.log('makeable: ', data)
          if (response.ok) {
              // console.log(data);
              setMakeableRecipes(data.recipes || []);
          }
      } catch (error) {
          console.error('Error', error);
          return { success: false, message: 'An error occured.' };
      }
  }
  
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

  const fetchTrendingRecipes = async () => {
    const url = `http://localhost:3000/recipe/trending?limit=6`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      mode: 'cors'
    });
    const data = await response.json();
    console.log('trending: ', data)
    if (response.ok) {
      setTrendingRecipes(data.recipes || []);
    }
  }

  const fetchRecentRecipes = async () => {
    const url = `http://localhost:3000/recipe/recent?limit=6`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      mode: 'cors'
    });
    const data = await response.json();
    console.log('recent: ', data)
    if (response.ok) {
      setRecentRecipes(data.recipes || []);
    }
  }

  const fetchPopularTags = async () => {
    const url = `http://localhost:3000/tag/popular?limit=8`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      mode: 'cors'
    });
    const data = await response.json();
    console.log('popular: ', data)
    if (response.ok) {
      setPopularTags(data.tags || []);
    }
  }

  return (
    <div className='app'>
      <Header />
      <h1>Test</h1>
      <button onClick={() => navigate('zerrdz')}>To the error page!</button>
      <Recommendations />
    </div>
  )
}
