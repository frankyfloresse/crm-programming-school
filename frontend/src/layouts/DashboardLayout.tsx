import { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Toolbar from '../components/Toolbar';

interface DashboardLayoutProps {
  children?: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-base-100 p-6">
      <Toolbar />
      <div className="mx-auto">
        {children || <Outlet />}
      </div>
    </div>
  );
}