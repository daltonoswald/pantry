import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Error from './pages/Error';

export default function Router() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Homepage />,
            errorElement: <Error />
        }
    ])
    return <RouterProvider router={router} />
}