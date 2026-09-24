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

function Root() {
    return (
        <>
            <ScrollToTop />
            <Outlet />
        </>
    )
}

export default function Router() {

    const router = createBrowserRouter([
        {
            element: <Root />,
            errorElement: <Error />,
            children: [
                { path: '/', element: <Homepage /> },
                { path: '/login', element: <Login /> },
                { path: '/sign-up', element: <Signup /> },
                { path: '/user/:username', element: <Profile /> },
                { path: '/recipe/:recipeId', element: <Recipe /> },
                { path: '/new-recipe', element: <NewRecipe /> },
                { path: '/search', element: <Search /> },
            ]
        }
    ])

    // const router = createBrowserRouter([
    //     {
    //         path: '/',
    //         element: <Homepage />,
    //         errorElement: <Error />
    //     },
    //     {
    //         path: '/login',
    //         element: <Login />,
    //     },
    //     {
    //         path: '/user/:username',
    //         element: <Profile />
    //     },
    //     {
    //         path: '/sign-up',
    //         element: <Signup />
    //     },
    //     {
    //         path: '/recipe/:recipeId',
    //         element: <Recipe />
    //     },
    //     {
    //         path: '/new-recipe',
    //         // element: <NewRecipe />
    //         element: <NewRecipe />
    //     },
    //     {
    //         path: '/search',
    //         element: <Search />
    //     }
    // ])
    return <RouterProvider router={router} />
}