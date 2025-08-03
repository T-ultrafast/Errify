import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DebugInfo = ({ authState, routeInfo }) => {
  const { user, isAuthenticated, loading, profileLoading, authLoading, initialized, forceStateReset, refreshProfile, forceProfileLoad, triggerProfileFetch, checkProfileInDatabase, profile } = useAuth();

  const handleForceRefresh = () => { window.location.reload(); };
  const handleForceAuth = () => { forceStateReset(); };
  const handleRefreshProfile = async () => { await refreshProfile(); };
  const handleForceProfileLoad = async () => { await forceProfileLoad(); };
  const handleTriggerProfileFetch = async () => { await triggerProfileFetch(); };
  const handleCheckDatabase = async () => { 
    const result = await checkProfileInDatabase();
    console.log('DebugInfo: Database check result:', result);
  };

  return (
    <div className="fixed bottom-2 right-2 bg-gray-800 text-white p-2 rounded shadow-lg text-xs z-50 max-w-48">
      <h3 className="font-bold mb-1 text-xs">Debug</h3>
      <div className="space-y-0.5 text-xs">
        <p><span className="text-gray-300">Auth:</span> {isAuthenticated ? '✅' : '❌'}</p>
        <p><span className="text-gray-300">Load:</span> {loading ? '⏳' : '✅'}</p>
        <p><span className="text-gray-300">Init:</span> {initialized ? '✅' : '❌'}</p>
        <p><span className="text-gray-300">AuthL:</span> {authLoading ? '⏳' : '✅'}</p>
        <p><span className="text-gray-300">ProfL:</span> {profileLoading ? '⏳' : '✅'}</p>
        <p><span className="text-gray-300">User:</span> {user?.email?.split('@')[0] || 'None'}</p>
        <p><span className="text-gray-300">ProfID:</span> {profile?.id?.slice(-8) || 'None'}</p>
        <p><span className="text-gray-300">ProfName:</span> {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'None'}</p>
        <p><span className="text-gray-300">Route:</span> {routeInfo?.pathname?.split('/')[1] || 'Unknown'}</p>
        <p><span className="text-gray-300">Time:</span> {new Date().toLocaleTimeString().slice(0, -3)}</p>
      </div>
      <div className="mt-2 space-y-1">
        <button onClick={handleForceRefresh} className="w-full bg-red-600 hover:bg-red-700 text-white px-1 py-0.5 rounded text-xs">Refresh</button>
        <button onClick={handleForceAuth} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-1 py-0.5 rounded text-xs">Auth Reset</button>
        <button onClick={handleRefreshProfile} className="w-full bg-green-600 hover:bg-green-700 text-white px-1 py-0.5 rounded text-xs">Refresh Prof</button>
        <button onClick={handleForceProfileLoad} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-1 py-0.5 rounded text-xs">Force Load</button>
        <button onClick={handleTriggerProfileFetch} className="w-full bg-orange-600 hover:bg-orange-700 text-white px-1 py-0.5 rounded text-xs">Trigger</button>
        <button onClick={handleCheckDatabase} className="w-full bg-teal-600 hover:bg-teal-700 text-white px-1 py-0.5 rounded text-xs">DB Check</button>
      </div>
    </div>
  );
};

export default DebugInfo; 