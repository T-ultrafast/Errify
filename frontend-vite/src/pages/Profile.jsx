import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileDebug from '../components/ProfileDebug';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Globe, 
  Linkedin, 
  ExternalLink,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  Bell,
  ChevronDown,
  Upload,
  Calendar,
  MapPin,
  FileText,
  Users,
  MessageSquare
} from 'lucide-react';

const Profile = () => {
  const { user, profile, profileLoading, refreshProfile, updateProfile, triggerProfileFetch } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Use authenticated user's data instead of hardcoded mock data
  const [userData, setUserData] = useState({
    profilePicture: null,
    firstName: '',
    lastName: '',
    institution: '',
    fieldOfResearch: '',
    professionalLinks: {
      linkedin: '',
      researchgate: '',
      orcid: ''
    },
    academicRecord: {
      degree: '',
      graduationYear: '',
      certifications: []
    },
    research: {
      interests: '',
      publications: []
    },
    degrees: [],
    researchExperience: [],
    publications: [],
    certifications: [],
    socialLinks: {
      linkedin: '',
      researchgate: '',
      orcid: ''
    }
  });

  // Update userData when profile changes
  useEffect(() => {
    if (profile) {
      console.log('Profile: Updating user data from profile:', profile);
      
      // Use the new first_name and last_name fields directly
      const firstName = profile.first_name || '';
      const lastName = profile.last_name || '';
      
      setUserData(prevData => ({
        ...prevData,
        firstName,
        lastName,
        institution: profile.institution || '',
        fieldOfResearch: profile.field || profile.field_of_study || '',
        professionalLinks: {
          linkedin: profile.linkedin || '',
          researchgate: profile.researchgate || '',
          orcid: profile.orcid || ''
        },
        academicRecord: {
          degree: profile.academic_record?.degree || '',
          graduationYear: profile.academic_record?.graduation_year || '',
          certifications: profile.academic_record?.certifications || []
        },
        research: {
          interests: profile.research?.interests || '',
          publications: profile.research?.publications || []
        }
      }));
    } else if (user && !profileLoading) {
      console.log('Profile: No profile data found for user:', user.id);
      // Use email username as fallback
      const emailUsername = user.email?.split('@')[0] || 'User';
      setUserData(prevData => ({
        ...prevData,
        firstName: emailUsername,
        lastName: '',
        institution: '',
        fieldOfResearch: '',
        professionalLinks: {
          linkedin: '',
          researchgate: '',
          orcid: ''
        },
        academicRecord: {
          degree: '',
          graduationYear: '',
          certifications: []
        },
        research: {
          interests: '',
          publications: []
        }
      }));
    }
  }, [profile, user, profileLoading]);

  // Force profile fetch when component mounts or when user changes
  useEffect(() => {
    if (user && !profile) {
      console.log('Profile: No profile found, triggering fetch...');
      triggerProfileFetch();
    }
  }, [user, profile, triggerProfileFetch]);

  const [newDegree, setNewDegree] = useState({
    type: '',
    major: '',
    institution: '',
    graduationYear: ''
  });

  const [newResearch, setNewResearch] = useState({
    title: '',
    focus: '',
    startDate: '',
    endDate: '',
    institution: ''
  });

  const [newPublication, setNewPublication] = useState({
    title: '',
    journal: '',
    link: ''
  });

  const [newCertification, setNewCertification] = useState({
    name: '',
    organization: '',
    date: ''
  });

  const handleSave = async () => {
    try {
      // Prepare the profile updates
      const profileUpdates = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        institution: userData.institution,
        field: userData.fieldOfResearch,
        linkedin: userData.professionalLinks.linkedin,
        researchgate: userData.professionalLinks.researchgate,
        orcid: userData.professionalLinks.orcid,
        academic_record: {
          degree: userData.academicRecord.degree,
          graduation_year: userData.academicRecord.graduationYear,
          certifications: userData.academicRecord.certifications
        },
        research: {
          interests: userData.research.interests,
          publications: userData.research.publications
        }
      };

      console.log('Profile: Saving profile updates:', profileUpdates);
      
      const result = await updateProfile(profileUpdates);
      
      if (result.success) {
        console.log('Profile: Profile updated successfully');
        setIsEditing(false);
      } else {
        console.error('Profile: Failed to update profile:', result.error);
        // You might want to show an error toast here
      }
    } catch (error) {
      console.error('Profile: Error saving profile:', error);
      // You might want to show an error toast here
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // TODO: Reset to original data
  };

  const addDegree = () => {
    if (newDegree.type && newDegree.major && newDegree.institution && newDegree.graduationYear) {
      setUserData(prev => ({
        ...prev,
        degrees: [...prev.degrees, { ...newDegree, id: Date.now() }]
      }));
      setNewDegree({ type: '', major: '', institution: '', graduationYear: '' });
    }
  };

  const addResearch = () => {
    if (newResearch.title && newResearch.focus && newResearch.startDate && newResearch.endDate && newResearch.institution) {
      setUserData(prev => ({
        ...prev,
        researchExperience: [...prev.researchExperience, { ...newResearch, id: Date.now() }]
      }));
      setNewResearch({ title: '', focus: '', startDate: '', endDate: '', institution: '' });
    }
  };

  const addPublication = () => {
    if (newPublication.title && newPublication.journal && newPublication.link) {
      setUserData(prev => ({
        ...prev,
        publications: [...prev.publications, { ...newPublication, id: Date.now() }]
      }));
      setNewPublication({ title: '', journal: '', link: '' });
    }
  };

  const addResearchPublication = () => {
    setUserData(prev => ({
      ...prev,
      research: {
        ...prev.research,
        publications: [...prev.research.publications, { title: '', journal: '', link: '' }]
      }
    }));
  };

  const addCertification = () => {
    if (newCertification.name && newCertification.organization && newCertification.date) {
      setUserData(prev => ({
        ...prev,
        certifications: [...prev.certifications, { ...newCertification, id: Date.now() }]
      }));
      setNewCertification({ name: '', organization: '', date: '' });
    }
  };

  const removeItem = (type, id) => {
    setUserData(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id)
    }));
  };

  const mockPosts = [
    {
      id: 1,
      title: 'Failed Attempt at CRISPR Delivery Method',
      content: 'After 6 months of research, our novel delivery method failed to show consistent results...',
      type: 'Failure',
      likes: 24,
      comments: 8,
      shares: 3,
      bookmarks: 12,
      time: '2 days ago'
    },
    {
      id: 2,
      title: 'Breakthrough in Gene Editing Efficiency',
      content: 'Successfully improved CRISPR efficiency by 40% using modified guide RNA...',
      type: 'Success',
      likes: 156,
      comments: 23,
      shares: 45,
      bookmarks: 67,
      time: '1 week ago'
    }
  ];

  const mockCollaborations = [
    {
      id: 1,
      researcher: 'Dr. Michael Chen',
      institution: 'MIT',
      interaction: 'Commented on your post about CRISPR delivery',
      time: '3 days ago'
    },
    {
      id: 2,
      researcher: 'Prof. Emily Rodriguez',
      institution: 'UC Berkeley',
      interaction: 'Collaborated on research paper about gene therapy',
      time: '1 week ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Errify</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Globe className="w-4 h-4" />
                  <span>English</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        English
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Español
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Français
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-700 hover:text-gray-900"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-3">Notifications</h3>
                      <div className="space-y-3">
                        <div className="text-sm">
                          <p className="font-medium">New comment on your post</p>
                          <p className="text-gray-600">Dr. Chen commented on your CRISPR research</p>
                          <p className="text-gray-400 text-xs">2 hours ago</p>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">Collaboration request</p>
                          <p className="text-gray-600">Prof. Rodriguez wants to collaborate</p>
                          <p className="text-gray-400 text-xs">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Picture */}
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug Information */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-md">
            <h3 className="font-bold text-yellow-800 mb-2">Debug Info (Profile Page)</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p><strong>User ID:</strong> {user?.id || 'None'}</p>
              <p><strong>User Email:</strong> {user?.email || 'None'}</p>
              <p><strong>Profile ID:</strong> {profile?.id || 'None'}</p>
              <p><strong>Profile Name:</strong> {profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'None' : 'None'}</p>
              <p><strong>Profile Loading:</strong> {profileLoading ? '⏳ Loading...' : '✅ Complete'}</p>
              <p><strong>Display Name:</strong> {userData.firstName} {userData.lastName}</p>
              <p><strong>Institution:</strong> {userData.institution}</p>
              <p><strong>Field:</strong> {userData.fieldOfResearch}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {profileLoading && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded-md">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-blue-800">Loading your profile data...</span>
            </div>
          </div>
        )}

        {/* No Profile State */}
        {!profileLoading && user && !profile && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-yellow-800 mb-2">Profile Not Found</h3>
                <p className="text-yellow-700 text-sm">No profile data found for your account. Click the button to create a basic profile.</p>
              </div>
              <button
                onClick={triggerProfileFetch}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 text-sm"
              >
                Create Profile
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {/* Profile Picture Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    {userData.profilePicture ? (
                      <img 
                        src={userData.profilePicture} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                      <Upload className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900">
                  {userData.firstName} {userData.lastName}
                </h2>
                <p className="text-gray-600">{userData.institution}</p>
                <p className="text-blue-600 font-medium">{userData.fieldOfResearch}</p>
              </div>

              {/* Edit Button */}
              <div className="mb-6">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center justify-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {/* Social & Professional Links */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Links</h3>
                <div className="space-y-3">
                  {userData.professionalLinks.linkedin && (
                    <div className="flex items-center space-x-3">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      <a 
                        href={userData.professionalLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        LinkedIn Profile
                      </a>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  {userData.professionalLinks.researchgate && (
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      <a 
                        href={userData.professionalLinks.researchgate} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline text-sm"
                      >
                        ResearchGate
                      </a>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  {userData.professionalLinks.orcid && (
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-purple-600" />
                      <a 
                        href={`https://orcid.org/${userData.professionalLinks.orcid}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline text-sm"
                      >
                        ORCID: {userData.professionalLinks.orcid}
                      </a>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  {!userData.professionalLinks.linkedin && !userData.professionalLinks.researchgate && !userData.professionalLinks.orcid && (
                    <div className="text-gray-500 text-sm italic">
                      No professional links added yet
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Activity</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{mockPosts.length}</div>
                    <div className="text-sm text-gray-600">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{mockCollaborations.length}</div>
                    <div className="text-sm text-gray-600">Collaborations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: User },
                    { id: 'academic', label: 'Academic Record', icon: GraduationCap },
                    { id: 'research', label: 'Research', icon: BookOpen },
                    { id: 'activity', label: 'Activity', icon: MessageSquare }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Overview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                          <input
                            type="text"
                            value={userData.firstName}
                            onChange={(e) => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
                            disabled={!isEditing}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                          <input
                            type="text"
                            value={userData.lastName}
                            onChange={(e) => setUserData(prev => ({ ...prev, lastName: e.target.value }))}
                            disabled={!isEditing}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
                          <input
                            type="text"
                            value={userData.institution}
                            onChange={(e) => setUserData(prev => ({ ...prev, institution: e.target.value }))}
                            disabled={!isEditing}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Field of Research *</label>
                          <input
                            type="text"
                            value={userData.fieldOfResearch}
                            onChange={(e) => setUserData(prev => ({ ...prev, fieldOfResearch: e.target.value }))}
                            disabled={!isEditing}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                          <input
                            type="url"
                            value={userData.professionalLinks.linkedin}
                            onChange={(e) => setUserData(prev => ({ 
                              ...prev, 
                              professionalLinks: { ...prev.professionalLinks, linkedin: e.target.value }
                            }))}
                            disabled={!isEditing}
                            placeholder="https://linkedin.com/in/yourprofile"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ResearchGate URL</label>
                          <input
                            type="url"
                            value={userData.professionalLinks.researchgate}
                            onChange={(e) => setUserData(prev => ({ 
                              ...prev, 
                              professionalLinks: { ...prev.professionalLinks, researchgate: e.target.value }
                            }))}
                            disabled={!isEditing}
                            placeholder="https://researchgate.net/profile/yourprofile"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ORCID ID</label>
                          <input
                            type="text"
                            value={userData.professionalLinks.orcid}
                            onChange={(e) => setUserData(prev => ({ 
                              ...prev, 
                              professionalLinks: { ...prev.professionalLinks, orcid: e.target.value }
                            }))}
                            disabled={!isEditing}
                            placeholder="0000-0000-0000-0000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Academic Record Tab */}
                {activeTab === 'academic' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                          <input
                            type="text"
                            value={userData.academicRecord.degree}
                            onChange={(e) => setUserData(prev => ({ 
                              ...prev, 
                              academicRecord: { ...prev.academicRecord, degree: e.target.value }
                            }))}
                            disabled={!isEditing}
                            placeholder="e.g., PhD, Master's, Bachelor's"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                          <input
                            type="text"
                            value={userData.academicRecord.graduationYear}
                            onChange={(e) => setUserData(prev => ({ 
                              ...prev, 
                              academicRecord: { ...prev.academicRecord, graduationYear: e.target.value }
                            }))}
                            disabled={!isEditing}
                            placeholder="e.g., 2023"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Academic Degrees</h3>
                        {isEditing && (
                          <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1">
                            <Plus className="w-4 h-4" />
                            <span>Add Degree</span>
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {userData.degrees.map((degree) => (
                          <div key={degree.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree Type</label>
                                    <input
                                      type="text"
                                      value={degree.type}
                                      disabled={!isEditing}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Major/Field</label>
                                    <input
                                      type="text"
                                      value={degree.major}
                                      disabled={!isEditing}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                                    <input
                                      type="text"
                                      value={degree.institution}
                                      disabled={!isEditing}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                                    <input
                                      type="text"
                                      value={degree.graduationYear}
                                      disabled={!isEditing}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                  </div>
                                </div>
                              </div>
                              {isEditing && (
                                <button
                                  onClick={() => removeItem('degrees', degree.id)}
                                  className="ml-2 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Certifications & Achievements</h3>
                        {isEditing && (
                          <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1">
                            <Plus className="w-4 h-4" />
                            <span>Add Certification</span>
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {userData.certifications.map((cert) => (
                          <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                                    <input
                                      type="text"
                                      value={cert.name}
                                      disabled={!isEditing}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
                                    <input
                                      type="text"
                                      value={cert.organization}
                                      disabled={!isEditing}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                      type="text"
                                      value={cert.date}
                                      disabled={!isEditing}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                  </div>
                                </div>
                              </div>
                              {isEditing && (
                                <button
                                  onClick={() => removeItem('certifications', cert.id)}
                                  className="ml-2 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Research Tab */}
                {activeTab === 'research' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Research Information</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Research Interests</label>
                        <textarea
                          value={userData.research.interests}
                          onChange={(e) => setUserData(prev => ({ 
                            ...prev, 
                            research: { ...prev.research, interests: e.target.value }
                          }))}
                          disabled={!isEditing}
                          rows={4}
                          placeholder="Describe your research interests, areas of expertise, and current research focus..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Research Publications</h3>
                        {isEditing && (
                          <button 
                            onClick={addResearchPublication}
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Publication</span>
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {userData.research.publications.map((pub, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title of Paper</label>
                                    <input
                                      type="text"
                                      value={pub.title || ''}
                                      onChange={(e) => {
                                        const updatedPublications = [...userData.research.publications];
                                        updatedPublications[index] = { ...updatedPublications[index], title: e.target.value };
                                        setUserData(prev => ({ 
                                          ...prev, 
                                          research: { ...prev.research, publications: updatedPublications }
                                        }));
                                      }}
                                      disabled={!isEditing}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Journal/Conference</label>
                                      <input
                                        type="text"
                                        value={pub.journal || ''}
                                        onChange={(e) => {
                                          const updatedPublications = [...userData.research.publications];
                                          updatedPublications[index] = { ...updatedPublications[index], journal: e.target.value };
                                          setUserData(prev => ({ 
                                            ...prev, 
                                            research: { ...prev.research, publications: updatedPublications }
                                          }));
                                        }}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                                      <input
                                        type="url"
                                        value={pub.link || ''}
                                        onChange={(e) => {
                                          const updatedPublications = [...userData.research.publications];
                                          updatedPublications[index] = { ...updatedPublications[index], link: e.target.value };
                                          setUserData(prev => ({ 
                                            ...prev, 
                                            research: { ...prev.research, publications: updatedPublications }
                                          }));
                                        }}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {isEditing && (
                                <button
                                  onClick={() => {
                                    const updatedPublications = userData.research.publications.filter((_, i) => i !== index);
                                    setUserData(prev => ({ 
                                      ...prev, 
                                      research: { ...prev.research, publications: updatedPublications }
                                    }));
                                  }}
                                  className="ml-2 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Publications */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Publications</h3>
                        {isEditing && (
                          <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1">
                            <Plus className="w-4 h-4" />
                            <span>Add Publication</span>
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {userData.publications.map((pub) => (
                          <div key={pub.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title of Paper</label>
                                    <input
                                      type="text"
                                      value={pub.title}
                                      disabled={!isEditing}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Journal/Conference</label>
                                      <input
                                        type="text"
                                        value={pub.journal}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                                      <input
                                        type="url"
                                        value={pub.link}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {isEditing && (
                                <button
                                  onClick={() => removeItem('publications', pub.id)}
                                  className="ml-2 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    {/* Recent Posts */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                      <div className="space-y-4">
                        {mockPosts.map((post) => (
                          <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">{post.title}</h4>
                                <p className="text-gray-600 text-sm mt-1">{post.content}</p>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                post.type === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {post.type}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>{post.time}</span>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Heart className="w-4 h-4" />
                                  <span>{post.likes}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{post.comments}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Share2 className="w-4 h-4" />
                                  <span>{post.shares}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Bookmark className="w-4 h-4" />
                                  <span>{post.bookmarks}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Collaboration History */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaboration History</h3>
                      <div className="space-y-4">
                        {mockCollaborations.map((collab) => (
                          <div key={collab.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">{collab.researcher}</span>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-600">{collab.institution}</span>
                                </div>
                                <p className="text-gray-600 text-sm mt-1">{collab.interaction}</p>
                                <p className="text-gray-400 text-xs mt-1">{collab.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Errify</h3>
              <p className="text-gray-600 text-sm">
                Connecting researchers through shared experiences of failure and success.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Help</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms</a></li>
                <li><a href="#" className="hover:text-gray-900">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Language</h4>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
              </select>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">
              © 2024 Errify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Debug Component */}
      <ProfileDebug />
    </div>
  );
};

export default Profile; 