import { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface AuthLayoutProps {
  children?: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-6">
      {children || <Outlet />}
    </div>
  );
}