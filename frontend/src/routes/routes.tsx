import { createBrowserRouter, replace } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/LoginPage';
import OrdersPage from '../pages/OrdersPage';
import NotFoundPage from '../pages/NotFoundPage';
import { ROUTES } from './constants';

export const router = createBrowserRouter([
  {
    path: ROUTES.AUTH,
    element: <AuthLayout />,
    loader: () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        return replace(ROUTES.HOME);
      }
      return null;
    },
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: ROUTES.HOME,
    element: <DashboardLayout />,
    loader: () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return replace(ROUTES.AUTH);
      }
      return null;
    },
    children: [
      {
        index: true,
        element: <OrdersPage />,
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);