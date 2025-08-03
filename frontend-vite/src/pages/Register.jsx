import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Building, 
  GraduationCap, 
  Upload,
  Check,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    countryCode: '+1',
    institutionName: '',
    fieldOfResearch: '',
    password: '',
    confirmPassword: '',
    profilePicture: null,
    agreeToTerms: false,
    linkedin: '',
    researchgate: '',
    orcid: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const researchFields = [
    'Chemistry',
    'Biology',
    'Physics',
    'Engineering',
    'Computer Science',
    'Mathematics',
    'Medicine',
    'Psychology',
    'Economics',
    'Environmental Science',
    'Materials Science',
    'Astronomy',
    'Geology',
    'Neuroscience',
    'Other'
  ];

  const countryCodes = [
    { code: '+1', country: 'US/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+61', country: 'Australia' },
    { code: '+234', country: 'Nigeria' },
    { code: '+27', country: 'South Africa' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.institutionName.trim()) {
      newErrors.institutionName = 'Institution name is required';
    }

    if (!formData.fieldOfResearch) {
      newErrors.fieldOfResearch = 'Field of research is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare profile data for Supabase with new first_name and last_name columns
      const profileData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        institution: formData.institutionName,
        field_of_study: formData.fieldOfResearch,
        bio: `Researcher in ${formData.fieldOfResearch} at ${formData.institutionName}`,
        linkedin: formData.linkedin,
        researchgate: formData.researchgate,
        orcid: formData.orcid
      };

      const result = await register(formData.email, formData.password, profileData);
      
      if (result.success) {
        toast.success('Account created successfully! Please check your email to verify your account.');
        navigate('/login');
      } else {
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
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
                <h3 className="font-bold text-gray-800 text-lg mb-2">Join the Community</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Connect with researchers worldwide</p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform -rotate-1 hover:rotate-0 transition-all duration-300 hover:scale-105">
                <Building className="w-16 h-16 text-indigo-600 mb-4" />
                <h3 className="font-bold text-gray-800 text-lg mb-2">Share Your Research</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Contribute to the academic community</p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform rotate-1 hover:rotate-0 transition-all duration-300 hover:scale-105">
                <User className="w-16 h-16 text-green-600 mb-4" />
                <h3 className="font-bold text-gray-800 text-lg mb-2">Build Your Profile</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Create your academic identity</p>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform -rotate-2 hover:rotate-0 transition-all duration-300 hover:scale-105">
                <Check className="w-16 h-16 text-purple-600 mb-4" />
                <h3 className="font-bold text-gray-800 text-lg mb-2">Learn from Failures</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Grow through shared experiences</p>
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

        {/* Right Side - Registration Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-blue-900">
          <div className="w-full max-w-md">
            {/* Top Navigation - Minimal and elegant */}
            <div className="flex justify-end space-x-8 text-sm text-gray-300 mb-12">
              <Link to="/home" className="hover:text-white transition-colors font-medium">
                Home
              </Link>
              <Link to="/login" className="hover:text-blue-300 transition-colors font-medium">
                Log In
              </Link>
            </div>

            {/* Header - Centered with proper spacing */}
            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Errify</h1>
              <h2 className="text-2xl font-semibold text-white mb-2">Join the Errify Community</h2>
              <p className="text-blue-200 text-base">Sign up to share your research experiences, collaborate, and learn from failures</p>
            </div>

            {/* Registration Form - Clean and professional */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="John"
                        required
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Doe"
                        required
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Institution Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john.doe@university.edu"
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1.5">
                    Use your academic or professional email
                  </p>
                </div>

                {/* Mobile Number Field */}
                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative w-24">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="w-full pl-3 pr-8 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base appearance-none"
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.code}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base ${
                          errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="1234567890"
                        required
                      />
                    </div>
                  </div>
                  {errors.mobileNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
                  )}
                </div>

                {/* Institution Name Field */}
                <div>
                  <label htmlFor="institutionName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Institution Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="institutionName"
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base ${
                        errors.institutionName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="University of Science and Technology"
                      required
                    />
                  </div>
                  {errors.institutionName && (
                    <p className="text-red-500 text-xs mt-1">{errors.institutionName}</p>
                  )}
                </div>

                {/* Field of Research Dropdown */}
                <div>
                  <label htmlFor="fieldOfResearch" className="block text-sm font-semibold text-gray-700 mb-2">
                    Field of Research *
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      id="fieldOfResearch"
                      name="fieldOfResearch"
                      value={formData.fieldOfResearch}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base appearance-none ${
                        errors.fieldOfResearch ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select your field of research</option>
                      {researchFields.map((field) => (
                        <option key={field} value={field}>
                          {field}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                  {errors.fieldOfResearch && (
                    <p className="text-red-500 text-xs mt-1">{errors.fieldOfResearch}</p>
                  )}
                </div>

                {/* Professional Links Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Professional Links (Optional)</h3>
                  
                  {/* LinkedIn */}
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-semibold text-gray-700 mb-2">
                      LinkedIn URL
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="url"
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>

                  {/* ResearchGate */}
                  <div>
                    <label htmlFor="researchgate" className="block text-sm font-semibold text-gray-700 mb-2">
                      ResearchGate URL
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="url"
                        id="researchgate"
                        name="researchgate"
                        value={formData.researchgate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
                        placeholder="https://researchgate.net/profile/yourprofile"
                      />
                    </div>
                  </div>

                  {/* ORCID */}
                  <div>
                    <label htmlFor="orcid" className="block text-sm font-semibold text-gray-700 mb-2">
                      ORCID ID
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        id="orcid"
                        name="orcid"
                        value={formData.orcid}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
                        placeholder="0000-0000-0000-0000"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Picture Upload */}
                <div>
                  <label htmlFor="profilePicture" className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile Picture (Optional)
                  </label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      onChange={handleChange}
                      accept="image/*"
                      className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Upload a profile picture for a personal touch
                  </p>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                      I agree to the{' '}
                      <Link to="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
                        Terms and Conditions
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
                        Privacy Policy
                      </Link>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>
                    )}
                  </div>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 text-base">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-950 text-gray-300 py-6 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Footer Links */}
            <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-sm">
              <Link to="/" className="hover:text-white transition-colors font-medium">
                Errify
              </Link>
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/help" className="hover:text-white transition-colors">
                Help
              </Link>
              <Link to="/about" className="hover:text-white transition-colors">
                About
              </Link>
              <Link to="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © 2024 Errify. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register; 