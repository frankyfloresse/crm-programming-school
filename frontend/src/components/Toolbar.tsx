import { useNavigate } from 'react-router-dom';
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
  const { isLoading: authLoading } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate(ROUTES.AUTH);
  };

  return (
    <div className="navbar bg-base-200 backdrop-blur-sm bg-opacity-80 rounded-xl shadow-lg mb-6 px-6">
      <div className="navbar-start">
        <h1 className="text-xl font-bold">LOGO</h1>
      </div>
      
      <div className="navbar-end space-x-2">
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