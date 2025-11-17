import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logoutUser } from '../store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ROUTES } from '../routes/constants';

function ThemeToggle() {
  const [theme, setTheme] = useState('dark');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  
  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

export default function Toolbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading: authLoading, user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate(ROUTES.AUTH);
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  const handleOrders = () => {
    navigate(ROUTES.HOME);
  };

  const isAdminPage = location.pathname === ROUTES.ADMIN;

  const handleLogoClick = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div className="navbar bg-base-200/80 backdrop-blur-sm rounded-xl shadow-lg mb-6 px-6">
      <div className="navbar-start">
        <button
          onClick={handleLogoClick}
          className="text-xl font-bold hover:opacity-80 transition-opacity cursor-pointer"
        >
          LOGO
        </button>
      </div>

      <div className="navbar-center">
        {user && (
          <div className="text-sm">
            <span className="font-medium">{user.firstName} {user.lastName}</span>
            <span className="ml-2 text-xs opacity-70">({user.role})</span>
          </div>
        )}
      </div>

      <div className="navbar-end space-x-2">
        {user?.role === 'admin' && (
          <button
            className="btn btn-primary btn-sm"
            onClick={isAdminPage ? handleOrders : handleAdminPanel}
          >
            {isAdminPage ? 'Orders' : 'Admin Panel'}
          </button>
        )}
        <ThemeToggle />
        <button
          className={`btn btn-error btn-sm ${authLoading ? 'loading' : ''}`}
          onClick={handleLogout}
          disabled={authLoading}
        >
          {authLoading ? 'Loading...' : 'Logout'}
        </button>
      </div>
    </div>
  );
}