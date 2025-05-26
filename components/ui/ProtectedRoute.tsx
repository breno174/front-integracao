
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AppScreen } from '../../types';

export const ProtectedRoute: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to={AppScreen.Login} replace />;
  }

  return <Outlet />;
};
