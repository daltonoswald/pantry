import Header from '../../components/header/Header';
import MakeableRecipes from './MakeableRecipes';
import { useState, useEffect } from 'react';
import Recent from './Recent';
import Trending from './Trending';
import { useAuth } from '../../context/AuthContext';

export default function Homepage() {
  const { token, username } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [makeableRecipes, setMakeableRecipes] = useState([]);
  const [recipesByPantry, setRecipesByPantry] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch different data based on login status
        if (token) {
          // Logged in: fetched personalized data
          await Promise.all([
            fetchMakeableRecipes(),
            getRecipesByPantry(),
            fetchTrendingRecipes(),
            fetchRecentRecipes(),
            fetchPopularTags()
          ]);
        } else {
          // Not logged in
          await Promise.all([
            fetchTrendingRecipes(),
            fetchRecentRecipes(),
            fetchRecentRecipes(),
            fetchPopularTags()
          ]);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
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
          if (response.ok) {
              setMakeableRecipes(data.recipes || []);
          }
      } catch (error) {
          console.error('Error', error);
          return { success: false, message: 'An error occured.' };
      }
  }

  const getRecipesByPantry = async (limit = 4, minMatch = 25) => {
    const url = `http://localhost:3000/recipe/by-pantry?limit=${limit}&minMatch=${minMatch}`
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

        if (response.ok) {
            setRecipesByPantry(data.recipes || [])
        }
    } catch (error) {
        console.error('Error', error);
        return { success: false, message: 'An error occured.' };
    }
}

  const fetchTrendingRecipes = async () => {
    const url = `http://localhost:3000/recipe/trending?limit=3`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      mode: 'cors'
    });
    const data = await response.json();
    if (response.ok) {
      setTrendingRecipes(data.recipes || []);
    }
  }

  const fetchRecentRecipes = async () => {
    const url = `http://localhost:3000/recipe/recent?limit=4`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      mode: 'cors'
    });
    const data = await response.json();
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
    console.log('popular tags: ', data)
    if (response.ok) {
      setPopularTags(data.tags || []);
    }
  }

  if (isLoading) return (
    <div className='app'>
      <Header />
      <div className='spinner-container'>
        <div className='loading-spinner'></div>
      </div>
    </div>
  )

  if (!isLoading) return (
    <div className='app'>
      <Header />
      <div className='homepage-container'>
        <Trending 
            trendingRecipes={trendingRecipes}
            popularTags={popularTags}
          />
            <MakeableRecipes 
            makeableRecipes={makeableRecipes}
            recipesByPantry={recipesByPantry}
            />
          <Recent 
            recentRecipes={recentRecipes}
          />
      </div>
    </div>
  )
}
