import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthTest from '../components/AuthTest';

const Dashboard = () => {
  const { user, isAuthenticated, loading, profileLoading, authLoading, initialized } = useAuth();

  console.log('Dashboard: Rendering with state', {
    user: user?.id,
    isAuthenticated,
    loading,
    profileLoading,
    authLoading,
    initialized
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* Debug Information */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h2>
        <div className="text-sm text-yellow-700 space-y-1">
          <p><strong>Initialized:</strong> {initialized ? 'Yes' : 'No'}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>Auth Process Loading:</strong> {authLoading ? 'Yes' : 'No'}</p>
          <p><strong>Profile Loading:</strong> {profileLoading ? 'Yes' : 'No'}</p>
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>User ID:</strong> {user?.id || 'None'}</p>
          <p><strong>Email:</strong> {user?.email || 'None'}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-center text-gray-600">
            Dashboard functionality will be implemented here.
          </p>
        </div>
        <AuthTest />
      </div>
    </div>
  );
};

export default Dashboard; 