import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import AuthProvider from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import Patents from './pages/Patents';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import DebugInfo from './components/DebugInfo';
import UniversalChat from './components/UniversalChat';
import socketService from './lib/socket';

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated, loading, initialized } = useAuth();
  const location = useLocation();

  console.log('AppContent: Auth state', { isAuthenticated, loading, initialized, pathname: location.pathname });

  // Initialize Socket.IO connection when user is authenticated
  useEffect(() => {
    if (isAuthenticated && initialized) {
      console.log('AppContent: Initializing Socket.IO connection');
      socketService.connect();
    } else if (!isAuthenticated) {
      console.log('AppContent: Disconnecting Socket.IO');
      socketService.disconnect();
    }
  }, [isAuthenticated, initialized]);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
        <Route path="/patents" element={<ProtectedRoute><Patents /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
              <h1 className="text-3xl font-bold text-gray-800">404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
      <Toaster />
      <DebugInfo authState={{ isAuthenticated, loading, initialized }} routeInfo={location} />
      {isAuthenticated && <UniversalChat />}
    </div>
  );
}

function App() {
  console.log('App: Rendering App component');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App; 