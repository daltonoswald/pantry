import Header from '../../components/header/Header';
import MakeableRecipes from './MakeableRecipes';
import { useState, useEffect } from 'react';
import Recent from './Recent';
import Trending from './Trending';
import { useAuth } from '../../context/AuthContext';
import PageTitle from '../../components/PageTitle';
import { apiGet } from '../../utils/api';

export default function Homepage() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [makeableRecipes, setMakeableRecipes] = useState([]);
  const [recipesByPantry, setRecipesByPantry] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const options = { token, signal: controller.signal };

    const load = async () => {
      const [trending, recent, tags, makeable, byPantry] = await Promise.allSettled([
        apiGet('/recipe/trending?limit=3', options),
        apiGet('/recipe/recent?limit=4', options),
        apiGet(`/tag/popular?limit=8`, options),
        token ? apiGet('/recipe/makeable', options) : Promise.resolve({}),
        token ? apiGet('/recipe/by-pantry?limit=4&minMatch=25', options) : Promise.resolve({})
      ]);
      if (controller.signal.aborted) return;

      const valueOf = (result) => (result.status === 'fulfilled' ? result.value : {});
      setTrendingRecipes(valueOf(trending).recipes || []);
      setRecentRecipes(valueOf(recent).recipes || []);
      setPopularTags(valueOf(tags).tags || []);
      setMakeableRecipes(valueOf(makeable).recipes || []);
      setRecipesByPantry(valueOf(byPantry).recipes || []);
      setIsLoading(false);
    };

    load();
    return () => controller.abort();
  }, [token])
  

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
      <PageTitle />
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
