import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../store/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, error, getUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold mb-2">Authentication Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute; 