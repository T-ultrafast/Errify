import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  User,
  Clock,
  Send,
  RefreshCw,
  Zap,
  LogIn,
  ChevronDown,
  ChevronUp,
  MessageCircle
} from 'lucide-react';
import { apiService } from '../lib/api';
import socketService from '../lib/socket';
import toast from 'react-hot-toast';

const PostCard = ({ 
  post, 
  user, 
  isAuthenticated, 
  onPostUpdate,
  showUserInfo = true 
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes || 0);
  const [localComments, setLocalComments] = useState(post.comments || []);

  // Initialize localComments with post comments if available
  useEffect(() => {
    if (post.comments && post.comments.length > 0) {
      setLocalComments(post.comments);
    }
  }, [post.comments]);

  // Connect to Socket.IO and set up real-time listeners
  useEffect(() => {
    // Connect to socket service
    socketService.connect();

    // Join post room for real-time updates
    socketService.joinPost(post.id);

    // Listen for real-time updates
    const handleNewComment = (data) => {
      if (data.postId === post.id) {
        setLocalComments(prev => [...prev, data.comment]);
        if (onPostUpdate) {
          onPostUpdate(post.id, { 
            comments: [...localComments, data.comment],
            contributes: (post.contributes || 0) + 1
          });
        }
      }
    };

    const handlePostLiked = (data) => {
      if (data.postId === post.id) {
        setLocalLikes(data.likeCount);
        if (onPostUpdate) {
          onPostUpdate(post.id, { likes: data.likeCount });
        }
      }
    };

    const handlePostUnliked = (data) => {
      if (data.postId === post.id) {
        setLocalLikes(data.likeCount);
        if (onPostUpdate) {
          onPostUpdate(post.id, { likes: data.likeCount });
        }
      }
    };

    // Add event listeners
    socketService.on('new_comment', handleNewComment);
    socketService.on('post_liked', handlePostLiked);
    socketService.on('post_unliked', handlePostUnliked);

    // Cleanup function
    return () => {
      socketService.leavePost(post.id);
      socketService.off('new_comment', handleNewComment);
      socketService.off('post_liked', handlePostLiked);
      socketService.off('post_unliked', handlePostUnliked);
    };
  }, [post.id, localComments, onPostUpdate]);

  // Handle authentication redirect
  const handleAuthRedirect = () => {
    toast.error('Please log in to interact with posts');
    // Redirect to login page
    window.location.href = '/login';
  };

  // Handle like click
  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      handleAuthRedirect();
      return;
    }

    try {
      const response = await apiService.likePost(post.id);
      setIsLiked(response.data.liked);
      setLocalLikes(response.data.likeCount);
      
      if (onPostUpdate) {
        onPostUpdate(post.id, { likes: response.data.likeCount });
      }
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to like post');
    }
  };

  // Handle contribute click
  const handleContributeClick = () => {
    if (!isAuthenticated) {
      handleAuthRedirect();
      return;
    }
    setShowCommentSection(!showCommentSection);
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      handleAuthRedirect();
      return;
    }

    if (!commentInput.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const commentData = {
        content: commentInput.trim(),
        isAnonymous: false
      };
      
      const response = await apiService.commentPost(post.id, commentData);
      
      // Add new comment to local state
      const newComment = {
        id: Date.now(), // Temporary ID
        user: user?.email?.split('@')[0] || 'You',
        content: commentInput,
        timestamp: 'Just now',
        isAnonymous: false
      };
      
      setLocalComments(prev => [...prev, newComment]);
      setCommentInput('');
      setShowCommentSection(false);
      
      if (onPostUpdate) {
        onPostUpdate(post.id, { 
          comments: [...localComments, newComment],
          contributes: (post.contributes || 0) + 1
        });
      }
      
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Comment error:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle clicking on contributes count
  const handleContributesClick = () => {
    if (localComments && localComments.length > 0) {
      setShowAllComments(!showAllComments);
    } else {
      // If no comments yet, open the comment section to add one
      setShowCommentSection(true);
    }
  };

  // Get comments to display (all or just preview)
  const getCommentsToDisplay = () => {
    if (!localComments || localComments.length === 0) return [];
    
    if (showAllComments) {
      return localComments;
    } else {
      // Show only first 2 comments as preview
      return localComments.slice(0, 2);
    }
  };

  const commentsToShow = getCommentsToDisplay();
  const hasMoreComments = localComments && localComments.length > 2 && !showAllComments;
  const hasComments = localComments && localComments.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {showUserInfo && (
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">
                    {post.authorName || user?.email?.split('@')[0] || 'You'}
                  </h3>
                  <span className="text-gray-500">•</span>
                  <span className="text-sm text-gray-600">
                    {post.isAnonymous ? 'Anonymous Post' : 'Your Post'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{post.timestamp}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    post.type === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {post.type}
                  </span>
                </div>
              </div>
            </div>
            
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          {post.title}
        </h4>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {post.content}
        </p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span>{localLikes} likes</span>
            <button 
              onClick={handleContributesClick}
              className={`hover:text-blue-600 transition-colors ${
                hasComments ? 'cursor-pointer' : 'cursor-default'
              }`}
              disabled={!hasComments}
            >
              {post.contributes || 0} contributes
            </button>
            <span>{post.debates || 0} debates</span>
            <span>{post.shares || 0} shares</span>
            <span>{post.bookmarks || 0} bookmarks</span>
          </div>
        </div>

        {/* Comment Section */}
        {showCommentSection && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add your comment..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  maxLength={2000}
                  name="comment"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {commentInput.length}/2000 characters
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowCommentSection(false)}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCommentSubmit}
                      disabled={isSubmitting || !commentInput.trim()}
                      className="px-4 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          <span>Submit</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments Display */}
        {(commentsToShow.length > 0 || showAllComments) && (
          <div className="mb-4 space-y-3">
            {commentsToShow.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">
                        {comment.isAnonymous ? 'Anonymous Researcher' : comment.user}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Show more/less comments button */}
            {hasMoreComments && (
              <button
                onClick={() => setShowAllComments(true)}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <span>Show {localComments.length - 2} more comments</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            
            {showAllComments && localComments && localComments.length > 2 && (
              <button
                onClick={() => setShowAllComments(false)}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <span>Show less</span>
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* No comments message when expanded but no comments */}
        {showAllComments && (!localComments || localComments.length === 0) && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg text-center">
            <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">No comments yet. Be the first to contribute!</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <button 
              onClick={handleLikeClick}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked 
                  ? 'text-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>Like</span>
            </button>
            
            <button 
              onClick={handleContributeClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Contribute</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-500 transition-colors">
              <Zap className="w-5 h-5" />
              <span>Debate</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
          
          <button className="flex items-center space-x-2 text-gray-600 hover:text-yellow-500 transition-colors">
            <Bookmark className="w-5 h-5" />
            <span>Bookmark</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 