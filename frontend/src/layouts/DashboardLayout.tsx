import { type ReactNode, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Toolbar from '../components/Toolbar';
import { getCurrentUser } from '../store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

interface DashboardLayoutProps {
  children?: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const dispatch = useAppDispatch();
  const { user, accessToken, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If we have a token but no user, fetch the current user
    if (accessToken && !user && !isLoading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, accessToken, user, isLoading]);

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <Toolbar />
      <div className="mx-auto">
        {children || <Outlet />}
      </div>
    </div>
  );
}