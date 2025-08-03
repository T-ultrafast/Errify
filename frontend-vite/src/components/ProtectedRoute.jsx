import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, profileLoading, authLoading, initialized } = useAuth();
  const location = useLocation();
  const [timeoutReached, setTimeoutReached] = useState(false);

  console.log('ProtectedRoute: State check', {
    loading,
    authLoading,
    profileLoading,
    initialized,
    isAuthenticated,
    timeoutReached,
    pathname: location.pathname,
    timestamp: new Date().toISOString()
  });

  // Simple timeout fallback
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading || !initialized) {
        console.log('ProtectedRoute: Timeout reached - forcing render');
        setTimeoutReached(true);
      }
    }, 8000);

    return () => clearTimeout(timeoutId);
  }, [loading, initialized]);

  // If timeout reached, render based on authentication
  if (timeoutReached) {
    console.log('ProtectedRoute: Timeout reached - rendering based on auth');
    if (isAuthenticated) {
      return children;
    } else {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // Show loading while initializing
  if (!initialized || loading) {
    console.log('ProtectedRoute: Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">
            {!initialized ? 'Initializing...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Show loading while authenticating
  if (authLoading) {
    console.log('ProtectedRoute: Showing auth loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  console.log('ProtectedRoute: Rendering protected component');
  return children;
};

export default ProtectedRoute; 