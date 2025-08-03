import React, { useState, useEffect } from 'react';
import { 
  Plus,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CreatePostModal from '../components/CreatePostModal';
import PostCard from '../components/PostCard';

const Posts = () => {
  const { user, isAuthenticated } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  // Mock user posts - in real implementation, fetch from Supabase
  useEffect(() => {
    if (isAuthenticated && user) {
      // TODO: Fetch user's posts from Supabase
      const mockUserPosts = [
        {
          id: 1,
          title: 'Failed Attempt at CRISPR Delivery Method',
          content: 'After 6 months of research, our novel delivery method failed to show consistent results. We tried various nanoparticle formulations but couldn\'t achieve the desired efficiency.',
          timestamp: '2 hours ago',
          type: 'Failure',
          tags: ['CRISPR', 'Gene Therapy', 'Nanoparticles'],
          likes: 24,
          contributes: 8,
          debates: 3,
          shares: 3,
          bookmarks: 12,
          comments: [
            {
              id: 1,
              user: 'Dr. Sarah Chen',
              content: 'Have you tried using lipid nanoparticles instead? We had similar issues but LNP delivery worked much better.',
              timestamp: '1 hour ago',
              isAnonymous: false
            },
            {
              id: 2,
              user: 'Anonymous Researcher',
              content: 'This is exactly what happened in our lab too. The nanoparticle aggregation was the main issue.',
              timestamp: '30 minutes ago',
              isAnonymous: true
            }
          ]
        },
        {
          id: 2,
          title: 'Breakthrough in Quantum Computing Algorithm',
          content: 'Successfully developed a new quantum algorithm that reduces computation time by 40%. This breakthrough came after 2 years of iterative improvements.',
          timestamp: '1 day ago',
          type: 'Success',
          tags: ['Quantum Computing', 'Algorithms', 'Innovation'],
          likes: 156,
          contributes: 23,
          debates: 45,
          shares: 45,
          bookmarks: 67,
          comments: [
            {
              id: 3,
              user: 'Prof. Michael Rodriguez',
              content: 'Impressive work! How does this compare to the latest IBM quantum algorithms?',
              timestamp: '12 hours ago',
              isAnonymous: false
            }
          ]
        }
      ];
      setUserPosts(mockUserPosts);
    }
  }, [isAuthenticated, user]);

  // Handle post updates from PostCard component
  const handlePostUpdate = (postId, updates) => {
    setUserPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, ...updates };
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              My Research Posts
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Your personal collection of research stories, failures, and successes. Share your journey with the academic community.
            </p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Post</span>
            </button>
          </div>
        </div>
      </section>

      {/* User's Posts */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">My Research Stories</h2>
          
          {userPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-6">Start sharing your research journey by creating your first post.</p>
              <button
                onClick={() => setShowCreatePost(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Post</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {userPosts.map((post) => (
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
          )}
        </div>
      </section>

      {/* Create Post Modal */}
      <CreatePostModal isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} />
    </div>
  );
};

export default Posts; 