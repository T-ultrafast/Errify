import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, GraduationCap, Microscope, Globe, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { login, resetPassword, isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();

  // Reset submitting state when auth state changes
  useEffect(() => {
    if (isAuthenticated && isSubmitting) {
      console.log('Login: Auth successful, resetting submitting state');
      setIsSubmitting(false);
    }
  }, [isAuthenticated, isSubmitting]);

  // Reset submitting state when auth loading stops
  useEffect(() => {
    if (!authLoading && isSubmitting) {
      console.log('Login: Auth loading stopped, resetting submitting state');
      setIsSubmitting(false);
    }
  }, [authLoading, isSubmitting]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Login: Attempting login with email:', formData.email);
      const result = await login(formData.email, formData.password);
      console.log('Login: Login result:', result);
      
      if (result.success) {
        toast.success('Successfully logged in!');
        console.log('Login: Navigating to /dashboard');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Login failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address first.');
      return;
    }

    setIsResettingPassword(true);

    try {
      console.log('Login: Attempting password reset for:', formData.email);
      const result = await resetPassword(formData.email);
      console.log('Login: Password reset result:', result);
      
      if (result.success) {
        toast.success('Password reset email sent! Please check your inbox.');
      } else {
        toast.error(result.error || 'Password reset failed. Please try again.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', error);
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-900">
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Side - Academic Research Visual Area */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 relative overflow-hidden">
          {/* Academic Research Visuals */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-8 p-12">
              {/* Academic Research Icons */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform rotate-2 hover:rotate-0 transition-all duration-300 hover:scale-105">
                <GraduationCap className="w-16 h-16 text-blue-600 mb-4" />
                <h3 className="font-bold text-gray-800 text-lg mb-2">Academic Excellence</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Join a community of researchers and scholars</p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform -rotate-1 hover:rotate-0 transition-all duration-300 hover:scale-105">
                <Microscope className="w-16 h-16 text-indigo-600 mb-4" />
                <h3 className="font-bold text-gray-800 text-lg mb-2">Research Innovation</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Share breakthroughs and discoveries</p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform rotate-1 hover:rotate-0 transition-all duration-300 hover:scale-105">
                <Globe className="w-16 h-16 text-green-600 mb-4" />
                <h3 className="font-bold text-gray-800 text-lg mb-2">Global Collaboration</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Connect with researchers worldwide</p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform -rotate-2 hover:rotate-0 transition-all duration-300 hover:scale-105">
                <Award className="w-16 h-16 text-purple-600 mb-4" />
                <h3 className="font-bold text-gray-800 text-lg mb-2">Recognition</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Get recognized for your contributions</p>
              </div>
            </div>
          </div>
          
          {/* Subtle academic background elements */}
          <div className="absolute top-8 left-8 opacity-5">
            <div className="w-40 h-40 border-4 border-blue-400 rounded-full"></div>
          </div>
          <div className="absolute bottom-8 right-8 opacity-5">
            <div className="w-32 h-32 border-4 border-indigo-400 rounded-full"></div>
          </div>
          <div className="absolute top-1/3 right-1/4 opacity-5">
            <div className="w-24 h-24 border-4 border-purple-400 rounded-full"></div>
          </div>
          
          {/* Academic pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="absolute top-40 left-40 w-1 h-1 bg-indigo-400 rounded-full"></div>
            <div className="absolute top-60 left-60 w-3 h-3 bg-purple-400 rounded-full"></div>
            <div className="absolute top-80 left-80 w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="absolute top-32 right-32 w-1 h-1 bg-blue-400 rounded-full"></div>
            <div className="absolute top-64 right-64 w-2 h-2 bg-indigo-400 rounded-full"></div>
          </div>
        </div>

        {/* Right Side - Clean Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-blue-900">
          <div className="w-full max-w-sm">
            {/* Top Navigation - Minimal and elegant */}
            <div className="flex justify-end space-x-8 text-sm text-gray-300 mb-12">
              <Link to="/register" className="hover:text-blue-300 transition-colors font-medium">
                Sign Up
              </Link>
            </div>

            {/* Logo and Header - Centered with proper spacing */}
            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Errify</h1>
              <h2 className="text-2xl font-semibold text-white mb-2">Log In</h2>
              <p className="text-blue-200 text-base">Access your research community</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="Institution Email"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={isResettingPassword || !formData.email}
                  className="text-sm text-blue-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResettingPassword ? 'Sending...' : 'Forgot Password?'}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-blue-200">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-300 hover:text-white transition-colors">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 