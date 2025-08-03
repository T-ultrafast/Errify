import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../lib/api';
import toast from 'react-hot-toast';

const AuthTest = () => {
  const { user, isAuthenticated, session, loading, profileLoading, authLoading, initialized } = useAuth();
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const testAuth = async () => {
    setTesting(true);
    try {
      // Test backend health
      const healthResponse = await apiService.health();
      console.log('Health check response:', healthResponse.data);
      
      let authResponse = null;
      if (isAuthenticated && session) {
        try {
          // Test authenticated endpoint
          authResponse = await apiService.getProfile();
          console.log('Auth test response:', authResponse.data);
        } catch (error) {
          console.error('Auth test error:', error);
          authResponse = { error: error.message };
        }
      }
      
      setTestResult({
        health: healthResponse.data,
        auth: authResponse?.data || { error: 'User not authenticated' },
        session: session ? {
          user_id: session.user?.id,
          email: session.user?.email,
          email_confirmed: !!session.user?.email_confirmed_at
        } : null
      });
      
      if (isAuthenticated && authResponse?.data) {
        toast.success('Authentication test successful!');
      } else {
        toast.error('Authentication test failed');
      }
    } catch (error) {
      console.error('Test error:', error);
      setTestResult({
        health: null,
        auth: { error: error.message },
        session: null
      });
      toast.error('Test failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Authentication Test</h2>
      
      <div className="mb-4 space-y-2">
        <p><strong>Initialized:</strong> {initialized ? 'Yes' : 'No'}</p>
        <p><strong>Auth Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Auth Process Loading:</strong> {authLoading ? 'Yes' : 'No'}</p>
        <p><strong>Profile Loading:</strong> {profileLoading ? 'Yes' : 'No'}</p>
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>User ID:</strong> {user?.id || 'None'}</p>
        <p><strong>Email:</strong> {user?.email || 'None'}</p>
        <p><strong>Email Confirmed:</strong> {user?.email_confirmed_at ? 'Yes' : 'No'}</p>
        <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
        <p><strong>Profile:</strong> {user?.id ? 'Loaded' : 'None'}</p>
      </div>

      <button
        onClick={testAuth}
        disabled={testing || loading || authLoading || !initialized}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {testing ? 'Testing...' : 'Test Authentication'}
      </button>

      {testResult && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AuthTest; 