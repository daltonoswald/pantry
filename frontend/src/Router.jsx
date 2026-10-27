import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import ScrollToTop from './utils/ScrollToTop'
import Homepage from './pages/homepage/Homepage';
import Error from './pages/Error';
import Login from './pages/login-signup/Login';
import Signup from './pages/login-signup/Signup';
import Profile from './pages/profile/Profile';
import Recipe from './pages/recipe/Recipe';
import NewRecipe from './pages/newRecipe/NewRecipe';
import Search from './pages/search/Search';
import ProfileAllRecipes from './pages/profile/ProfileAllRecipes';
import { ToastProvider } from './components/toast/ToastContext';
import { AuthProvider } from './context/AuthContext';

function Root() {
    return (
        <>
            <ScrollToTop />
            <Outlet />
        </>
    )
}

const router = createBrowserRouter([
    {
        element: <Root />,
        errorElement: <Error />,
        children: [
            { path: '/', element: <Homepage /> },
            { path: '/login', element: <Login /> },
            { path: '/sign-up', element: <Signup /> },
            { path: '/user/:username', element: <Profile /> },
            { path: '/user/:username/all-recipes', element: <ProfileAllRecipes />},
            { path: '/recipe/:recipeId', element: <Recipe /> },
            { path: '/new-recipe', element: <NewRecipe /> },
            { path: '/search', element: <Search /> },
        ]
    }
])

export default function Router() {

    return (
        <AuthProvider>
            <ToastProvider>
                <RouterProvider router={router} />
            </ToastProvider>
        </AuthProvider>
    )
}