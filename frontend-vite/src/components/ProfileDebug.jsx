import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfileDebug = () => {
  const { user, profile, profileLoading, session } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="font-bold mb-2">Profile Debug Info</h3>
      <div className="text-xs space-y-1">
        <div><strong>User ID:</strong> {user?.id || 'None'}</div>
        <div><strong>User Email:</strong> {user?.email || 'None'}</div>
        <div><strong>Session:</strong> {session ? 'Active' : 'None'}</div>
        <div><strong>Profile Loading:</strong> {profileLoading ? '⏳ Loading...' : '✅ Complete'}</div>
        <div><strong>Profile ID:</strong> {profile?.id || 'None'}</div>
        <div><strong>Profile Name:</strong> {profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'None' : 'None'}</div>
        <div><strong>Profile Email:</strong> {profile?.email || 'None'}</div>
        <div><strong>Institution:</strong> {profile?.institution || 'None'}</div>
        <div><strong>Field:</strong> {profile?.field || 'None'}</div>
        <div><strong>LinkedIn:</strong> {profile?.linkedin || 'None'}</div>
        <div><strong>ResearchGate:</strong> {profile?.researchgate || 'None'}</div>
        <div><strong>ORCID:</strong> {profile?.orcid || 'None'}</div>
        <div><strong>Created:</strong> {profile?.created_at ? new Date(profile.created_at).toLocaleString() : 'None'}</div>
        <div><strong>Updated:</strong> {profile?.updated_at ? new Date(profile.updated_at).toLocaleString() : 'None'}</div>
      </div>
      
      {profile && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs">Raw Profile Data</summary>
          <pre className="text-xs mt-1 overflow-auto max-h-32">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default ProfileDebug; 