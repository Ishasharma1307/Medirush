import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const PharmacyRoute = () => {
  const { user, userProfile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-primary" size={36} />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Verifying Pharmacy Access...</p>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Determine user role (from database profile or session metadata fallback)
  const role = userProfile?.role || user?.user_metadata?.role || 'user';

  // Prevent non-pharmacy users (customers) from accessing pharmacy portal
  if (role !== 'pharmacy' && role !== 'admin') {
    console.warn('Unauthorized access attempt to Pharmacy Portal by role:', role);
    return <Navigate to="/home" replace />;
  }
  
  // Render pharmacy portal child components
  return <Outlet />;
};
