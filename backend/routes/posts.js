const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');
const supabaseAuth = require('../middleware/supabaseAuth');

const router = express.Router();

// Get the Socket.IO instance
let io;
const setSocketIO = (socketIO) => {
  io = socketIO;
};

// @route   POST /api/posts
// @desc    Create a new failure story post
// @access  Private
router.post('/', supabaseAuth, async (req, res, next) => {
  console.log('POST /api/posts - Request received');
  console.log('User:', req.user);
  console.log('Request body:', req.body);
  next();
}, [
  body('title')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 50, max: 10000 })
    .withMessage('Content must be between 50 and 10000 characters'),
  body('category')
    .isIn([
      'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science',
      'Engineering', 'Medicine', 'Psychology', 'Economics', 'Business',
      'Arts', 'Literature', 'History', 'Philosophy', 'Other'
    ])
    .withMessage('Please select a valid category'),
  body('failureDetails.whatWentWrong')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('What went wrong must be between 20 and 2000 characters'),
  body('failureDetails.lessonsLearned')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Lessons learned must be between 20 and 2000 characters'),
  body('failureDetails.nextSteps')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Next steps must be between 10 and 2000 characters'),
  body('failureDetails.impact')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Please select a valid impact level'),
  body('failureDetails.timeLost')
    .optional()
    .isIn(['Hours', 'Days', 'Weeks', 'Months', 'Years'])
    .withMessage('Please select a valid time period'),
  body('collaboration.isRequestingHelp')
    .optional()
    .isBoolean()
    .withMessage('isRequestingHelp must be a boolean'),
  body('collaboration.helpDescription')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Help description must be between 10 and 1000 characters'),
  body('privacy.visibility')
    .optional()
    .isIn(['Public', 'Private', 'Friends', 'Institution'])
    .withMessage('Please select a valid privacy level'),
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      content,
      category,
      tags,
      media,
      failureDetails,
      collaboration,
      privacy,
      isAnonymous
    } = req.body;

    // Create new post
    const post = new Post({
      author: req.user.id,
      title,
      content,
      category,
      tags: tags || [],
      media: media || {},
      failureDetails,
      collaboration: {
        ...collaboration,
        isRequestingHelp: collaboration?.isRequestingHelp || false
      },
      privacy: {
        ...privacy,
        visibility: privacy?.visibility || 'Public',
        allowComments: privacy?.allowComments !== false,
        allowSharing: privacy?.allowSharing !== false
      },
      isAnonymous: isAnonymous || false
    });

    const savedPost = await post.save();
    console.log('Post created successfully:', savedPost);

    // Emit real-time update for new post
    if (io) {
      io.emit('new_post', {
        post: savedPost,
        message: 'New research post created'
      });
    }

    res.status(201).json({
      message: 'Post created successfully',
      post: savedPost
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      error: 'Failed to create post',
      message: error.message
    });
  }
});

// @route   GET /api/posts
// @desc    Get all posts with optional filtering
// @access  Public
router.get('/', [
  query('category').optional().isString(),
  query('type').optional().isIn(['Success', 'Failure', 'Learning', 'Breakthrough']),
  query('author').optional().isMongoId(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 }),
  query('sort').optional().isIn(['newest', 'oldest', 'popular', 'trending']),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      category,
      type,
      author,
      limit = 20,
      page = 1,
      sort = 'newest',
      search
    } = req.query;

    // Build filter object
    const filter = { status: 'Active' };

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (author) filter.author = author;

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'popular':
        sortObj = { 'engagement.likes': -1 };
        break;
      case 'trending':
        sortObj = { 'engagement.views': -1 };
        break;
      default: // newest
        sortObj = { createdAt: -1 };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query
    const posts = await Post.find(filter);

    // Sort posts (client-side sorting for now)
    posts.sort((a, b) => {
      if (sortObj.createdAt === -1) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    // Apply pagination
    const startIndex = skip;
    const endIndex = skip + parseInt(limit);
    const paginatedPosts = posts.slice(startIndex, endIndex);

    // Get total count for pagination
    const total = posts.length;

    res.json({
      posts: paginatedPosts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      error: 'Failed to fetch posts',
      message: error.message
    });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a specific post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: 'Post does not exist'
      });
    }

    // Increment view count
    post.engagement.views += 1;
    await post.save();

    res.json(post);

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      error: 'Failed to fetch post',
      message: error.message
    });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', supabaseAuth, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 50, max: 10000 })
    .withMessage('Content must be between 50 and 10000 characters'),
  body('category')
    .optional()
    .isIn([
      'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science',
      'Engineering', 'Medicine', 'Psychology', 'Economics', 'Business',
      'Arts', 'Literature', 'History', 'Philosophy', 'Other'
    ])
    .withMessage('Please select a valid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: 'Post does not exist'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        error: 'Unauthorized',
        message: 'You can only edit your own posts'
      });
    }

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('author', 'email firstName lastName');

    // Emit real-time update for post edit
    if (io) {
      io.emit('post_updated', {
        postId: req.params.id,
        post: updatedPost,
        message: 'Post updated'
      });
    }

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      error: 'Failed to update post',
      message: error.message
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', supabaseAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: 'Post does not exist'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        error: 'Unauthorized',
        message: 'You can only delete your own posts'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    // Emit real-time update for post deletion
    if (io) {
      io.emit('post_deleted', {
        postId: req.params.id,
        message: 'Post deleted'
      });
    }

    res.json({
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      error: 'Failed to delete post',
      message: error.message
    });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like or unlike a post
// @access  Private
router.post('/:id/like', supabaseAuth, async (req, res) => {
  try {
    console.log('Like request user:', req.user);
    
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: 'Post does not exist'
      });
    }

    // Check if user already liked the post
    const existingLike = post.engagement.likes.includes(req.user.id);

    if (existingLike) {
      // Unlike
      await post.removeLike(req.user.id);
      
      // Emit real-time update for unlike
      if (io) {
        io.to(`post_${req.params.id}`).emit('post_unliked', {
          postId: req.params.id,
          userId: req.user.id,
          likeCount: post.engagement.likes.length,
          message: 'Post unliked'
        });
      }
      
      res.json({
        message: 'Post unliked successfully',
        liked: false,
        likeCount: post.engagement.likes.length
      });
    } else {
      // Like
      await post.addLike(req.user.id);
      
      // Emit real-time update for like
      if (io) {
        io.to(`post_${req.params.id}`).emit('post_liked', {
          postId: req.params.id,
          userId: req.user.id,
          likeCount: post.engagement.likes.length,
          message: 'Post liked'
        });
      }
      
      res.json({
        message: 'Post liked successfully',
        liked: true,
        likeCount: post.engagement.likes.length
      });
    }

  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      error: 'Failed to like/unlike post',
      message: error.message
    });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comment', supabaseAuth, [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Comment must be between 1 and 2000 characters'),
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean')
], async (req, res) => {
  try {
    console.log('Comment request body:', req.body);
    console.log('Comment request user:', req.user);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: 'Post does not exist'
      });
    }

    const { content, isAnonymous = false } = req.body;

    // Add comment using the new Supabase-based method
    const newComment = await post.addComment(req.user.id, content, isAnonymous);

    // Emit real-time update for new comment
    if (io) {
      io.to(`post_${req.params.id}`).emit('new_comment', {
        postId: req.params.id,
        comment: {
          id: newComment.id,
          user: req.user.email?.split('@')[0] || 'Anonymous',
          content: newComment.content,
          timestamp: newComment.timestamp,
          isAnonymous: newComment.isAnonymous
        },
        message: 'New comment added'
      });
    }

    res.json({
      message: 'Comment added successfully',
      comment: {
        id: newComment.id,
        user: req.user.email?.split('@')[0] || 'Anonymous',
        content: newComment.content,
        timestamp: newComment.timestamp,
        isAnonymous: newComment.isAnonymous
      }
    });

  } catch (error) {
    console.error('Comment post error:', error);
    res.status(500).json({
      error: 'Failed to add comment',
      message: error.message
    });
  }
});

// @route   POST /api/posts/:id/collaborate
// @desc    Request collaboration on a post
// @access  Private
router.post('/:id/collaborate', supabaseAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: 'Post does not exist'
      });
    }

    if (!post.collaboration.isRequestingHelp) {
      return res.status(400).json({
        error: 'No collaboration needed',
        message: 'This post is not requesting collaboration'
      });
    }

    if (post.collaboration.collaborators.length >= post.collaboration.maxCollaborators) {
      return res.status(400).json({
        error: 'Collaboration full',
        message: 'Maximum number of collaborators reached'
      });
    }

    await post.requestCollaboration(req.user.id);

    res.json({
      message: 'Collaboration request sent successfully'
    });

  } catch (error) {
    console.error('Request collaboration error:', error);
    res.status(500).json({
      error: 'Failed to request collaboration',
      message: error.message
    });
  }
});

module.exports = { router, setSocketIO }; 