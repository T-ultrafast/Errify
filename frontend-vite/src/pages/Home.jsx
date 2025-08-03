import React, { useState, useEffect } from 'react';
import { 
  Filter,
  Search,
  RefreshCw,
  Plus,
  MessageCircle
} from 'lucide-react';
import CreatePostModal from '../components/CreatePostModal';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Add debugging for authentication
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  console.log('Home: Authentication state:', { isAuthenticated, user: user?.id, authLoading });

  // Mock data for demonstration
  const mockPosts = [
    {
      id: 1,
      authorName: 'Dr. Sarah Johnson',
      authorInstitution: 'Stanford University',
      title: 'Failed Attempt at CRISPR Delivery Method',
      content: 'After 6 months of research, our novel delivery method failed to show consistent results. We tried various nanoparticle formulations but couldn\'t achieve the desired efficiency. This taught us valuable lessons about the importance of preliminary testing.',
      type: 'Failure',
      category: 'Molecular Biology',
      likes: 24,
      contributes: 8,
      debates: 3,
      shares: 3,
      bookmarks: 12,
      timestamp: '2 hours ago',
      tags: ['CRISPR', 'Gene Therapy', 'Nanoparticles'],
      comments: [
        {
          id: 1,
          user: 'Dr. Emily Chen',
          content: 'Have you tried using lipid nanoparticles instead? We had similar issues but LNP delivery worked much better.',
          timestamp: '1 hour ago',
          isAnonymous: false
        }
      ]
    },
    {
      id: 2,
      authorName: 'Prof. Michael Chen',
      authorInstitution: 'MIT',
      title: 'Breakthrough in Quantum Computing Algorithm',
      content: 'Successfully developed a new quantum algorithm that reduces computation time by 40%. This breakthrough came after 2 years of iterative improvements and countless failed attempts. The key was combining classical and quantum approaches.',
      type: 'Success',
      category: 'Computer Science',
      likes: 156,
      contributes: 23,
      debates: 45,
      shares: 45,
      bookmarks: 67,
      timestamp: '1 day ago',
      tags: ['Quantum Computing', 'Algorithms', 'Innovation'],
      comments: [
        {
          id: 2,
          user: 'Prof. David Rodriguez',
          content: 'Impressive work! How does this compare to the latest IBM quantum algorithms?',
          timestamp: '12 hours ago',
          isAnonymous: false
        }
      ]
    },
    {
      id: 3,
      authorName: 'Dr. Emily Rodriguez',
      authorInstitution: 'UC Berkeley',
      title: 'Unexpected Results in Climate Modeling',
      content: 'Our climate model predictions were completely off. We discovered that our assumptions about ocean currents were flawed. This failure led us to develop a more comprehensive model that now accounts for previously ignored variables.',
      type: 'Failure',
      category: 'Environmental Science',
      likes: 89,
      contributes: 15,
      debates: 12,
      shares: 12,
      bookmarks: 34,
      timestamp: '3 days ago',
      tags: ['Climate Science', 'Modeling', 'Oceanography'],
      comments: []
    },
    {
      id: 4,
      authorName: 'Prof. David Kim',
      authorInstitution: 'Harvard University',
      title: 'Revolutionary Drug Discovery Method',
      content: 'Developed a new AI-driven approach to drug discovery that increased success rate by 60%. This method combines machine learning with traditional pharmaceutical research, leading to faster and more accurate predictions.',
      type: 'Success',
      category: 'Medicine',
      likes: 234,
      contributes: 45,
      debates: 67,
      shares: 89,
      bookmarks: 123,
      timestamp: '1 week ago',
      tags: ['AI', 'Drug Discovery', 'Machine Learning'],
      comments: [
        {
          id: 3,
          user: 'Dr. Lisa Wang',
          content: 'This is groundbreaking! What datasets did you use for training the AI model?',
          timestamp: '2 days ago',
          isAnonymous: false
        }
      ]
    }
  ];

  useEffect(() => {
    loadFeed();
  }, [filter, searchQuery, refreshTrigger]);

  const loadFeed = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter posts based on current filter and search
    let filteredPosts = mockPosts;
    
    if (filter === 'success') {
      filteredPosts = mockPosts.filter(post => post.type === 'Success');
    } else if (filter === 'failure') {
      filteredPosts = mockPosts.filter(post => post.type === 'Failure');
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setPosts(filteredPosts);
    setLoading(false);
  };

  const handlePostUpdate = (postId, updates) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, ...updates };
      }
      return post;
    }));
  };

  const refreshFeed = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const getTypeColor = (type) => {
    return type === 'Success' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Research Stories & Failures
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover real research experiences from scientists worldwide. Learn from both successes and failures in the academic community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowCreatePost(true)}
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Share Your Story</span>
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors">
                Explore Research
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter and Search Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">Research Feed</h2>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">All Posts</option>
                  <option value="success">Success Stories</option>
                  <option value="failure">Failure Stories</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshFeed}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                title="Refresh Feed"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={() => setShowCreatePost(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </button>
            </div>
          </div>
          
          <div className="relative mt-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading latest research stories...</p>
          </div>
        )}

        {/* Feed Posts */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              user={user}
              isAuthenticated={isAuthenticated}
              onPostUpdate={handlePostUpdate}
              showUserInfo={true}
            />
          ))}
        </div>

        {/* Load More Button */}
        {!loading && posts.length > 0 && (
          <div className="text-center mt-8">
            <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              Load More Posts
            </button>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={showCreatePost} 
        onClose={() => setShowCreatePost(false)} 
      />
    </div>
  );
};

export default Home; 