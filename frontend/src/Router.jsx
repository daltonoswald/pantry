import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Error from './pages/Error';
import Login from './pages/Login';

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
        }
    ])
    return <RouterProvider router={router} />
}