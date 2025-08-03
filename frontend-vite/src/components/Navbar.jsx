import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogIn, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, profile, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-2xl font-bold text-gray-900">
              Errify
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link to="/home" className="text-gray-600 hover:text-gray-900">
                    Home
                  </Link>
                  <Link to="/posts" className="text-gray-600 hover:text-gray-900">
                    Posts
                  </Link>
                  <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                    Dashboard
                  </Link>
                  <Link to="/patents" className="text-gray-600 hover:text-gray-900">
                    Patents
                  </Link>
                  <Link to="/resources" className="text-gray-600 hover:text-gray-900">
                    Resources
                  </Link>
                </>
              ) : (
                <Link to="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications - Only show for authenticated users */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-3 hover:bg-gray-50 border-b">
                        <p className="text-sm text-gray-800">Dr. Sarah Johnson commented on your post</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                      <div className="p-3 hover:bg-gray-50 border-b">
                        <p className="text-sm text-gray-800">New research collaboration request</p>
                        <p className="text-xs text-gray-500">1 hour ago</p>
                      </div>
                      <div className="p-3 hover:bg-gray-50">
                        <p className="text-sm text-gray-800">Your post received 5 new likes</p>
                        <p className="text-xs text-gray-500">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Section */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium">
                      {profile?.first_name || user?.email?.split('@')[0] || 'User'}
                    </span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 