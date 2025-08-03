import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Errify
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/posts" className="text-gray-700 hover:text-blue-600">
              Failure Stories
            </Link>
            <Link to="/patents" className="text-gray-700 hover:text-blue-600">
              Patents
            </Link>
            <Link to="/resources" className="text-gray-700 hover:text-blue-600">
              Resources
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 