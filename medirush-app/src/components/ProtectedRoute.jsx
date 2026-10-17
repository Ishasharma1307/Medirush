import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading, loginAsDemo } = useAuth();
  const location = useLocation();

  const isPublicFriendlyRoute = 
    location.pathname.startsWith('/emergency') ||
    location.pathname.startsWith('/prescription-upload') ||
    location.pathname.startsWith('/symptom-checker') ||
    location.pathname.startsWith('/nearby');

  useEffect(() => {
    if (!loading && !user && isPublicFriendlyRoute && loginAsDemo) {
      loginAsDemo();
    }
  }, [loading, user, isPublicFriendlyRoute, loginAsDemo]);
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-gray-500 font-medium">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <span>Preparing MediRush healthcare network...</span>
      </div>
    );
  }

  if (!user && !isPublicFriendlyRoute) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Prevent pharmacy and rider users from accessing patient routes
  const userRole = user?.user_metadata?.role;
  if (userRole === 'pharmacy') {
    return <Navigate to="/pharmacy-partner" replace />;
  }
  if (userRole === 'rider') {
    return <Navigate to="/delivery-partner" replace />;
  }
  
  // Render the child components if the user is authenticated (or guest)
  return <Outlet />;
};
