import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Error from './pages/Error';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Recipe from './pages/recipe/Recipe';
import NewRecipe from './pages/NewRecipe';
import Search from './pages/search/Search';

export default function Router() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Homepage />,
            errorElement: <Error />
        },
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '/user/:username',
            element: <Profile />
        },
        {
            path: '/sign-up',
            element: <Signup />
        },
        {
            path: '/recipe/:recipeId',
            element: <Recipe />
        },
        {
            path: '/new-recipe',
            element: <NewRecipe />
        },
        {
            path: '/search',
            element: <Search />
        }
    ])
    return <RouterProvider router={router} />
}