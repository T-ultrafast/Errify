const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const supabaseAuth = require('../middleware/supabaseAuth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users with filtering and pagination
// @access  Public
router.get('/', [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Search term must be at least 2 characters'),
  query('fieldOfExpertise')
    .optional()
    .isIn([
      'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science',
      'Engineering', 'Medicine', 'Psychology', 'Economics', 'Business',
      'Arts', 'Literature', 'History', 'Philosophy', 'Other'
    ]),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('sort')
    .optional()
    .isIn(['reputation', 'posts', 'newest', 'oldest'])
    .withMessage('Invalid sort option'),
  query('verified')
    .optional()
    .isBoolean()
    .withMessage('verified must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      search,
      fieldOfExpertise,
      page = 1,
      limit = 10,
      sort = 'reputation',
      verified
    } = req.query;

    // Build filter query
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { 'profile.bio': { $regex: search, $options: 'i' } },
        { 'profile.researchInterests': { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (fieldOfExpertise) {
      filter['profile.fieldOfExpertise'] = fieldOfExpertise;
    }

    if (verified === 'true') {
      filter['verification.isVerified'] = true;
    }

    // Build sort query
    let sortQuery = {};
    switch (sort) {
      case 'reputation':
        sortQuery = { 'stats.reputation': -1 };
        break;
      case 'posts':
        sortQuery = { 'stats.postsCount': -1 };
        break;
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get users
    const users = await User.find(filter)
      .select('-password')
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await User.countDocuments(filter);

    res.json({
      users: users.map(user => user.getPublicProfile()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to get users',
      message: error.message
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get a specific user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    if (!user.isActive) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account is not active'
      });
    }

    res.json({
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user',
      message: error.message
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', supabaseAuth, [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('profile.bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('profile.fieldOfExpertise')
    .optional()
    .isIn([
      'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science',
      'Engineering', 'Medicine', 'Psychology', 'Economics', 'Business',
      'Arts', 'Literature', 'History', 'Philosophy', 'Other'
    ])
    .withMessage('Please select a valid field of expertise'),
  body('profile.position')
    .optional()
    .isIn(['Student', 'Researcher', 'Professor', 'Industry Professional', 'Other'])
    .withMessage('Please select a valid position'),
  body('profile.academicLevel')
    .optional()
    .isIn(['Undergraduate', 'Graduate', 'PhD', 'PostDoc', 'Faculty', 'Industry'])
    .withMessage('Please select a valid academic level'),
  body('privacy.profileVisibility')
    .optional()
    .isIn(['Public', 'Private', 'Friends'])
    .withMessage('Please select a valid privacy level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser.getPublicProfile()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message
    });
  }
});

// @route   POST /api/users/verify
// @desc    Verify another user (admin/peer verification)
// @access  Private
router.post('/verify/:userId', supabaseAuth, [
  body('verificationMethod')
    .isIn(['Institution', 'Peer', 'Admin'])
    .withMessage('Please select a valid verification method'),
  body('reason')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { verificationMethod, reason } = req.body;
    const targetUserId = req.params.userId;

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User to verify does not exist'
      });
    }

    // Check if user is already verified
    if (targetUser.verification.isVerified) {
      return res.status(400).json({
        error: 'User already verified',
        message: 'This user is already verified'
      });
    }

    // Update verification status
    targetUser.verification = {
      isVerified: true,
      verifiedBy: req.user.id,
      verifiedAt: new Date(),
      verificationMethod
    };

    await targetUser.save();

    res.json({
      message: 'User verified successfully',
      user: targetUser.getPublicProfile()
    });

  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({
      error: 'Failed to verify user',
      message: error.message
    });
  }
});

// @route   GET /api/users/me/stats
// @desc    Get current user statistics
// @access  Private
router.get('/me/stats', supabaseAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('stats badges');
    
    res.json({
      stats: user.stats,
      badges: user.badges
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to get stats',
      message: error.message
    });
  }
});

// @route   POST /api/users/follow/:userId
// @desc    Follow/unfollow a user
// @access  Private
router.post('/follow/:userId', supabaseAuth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User to follow does not exist'
      });
    }

    // Check if trying to follow self
    if (targetUserId === req.user.id) {
      return res.status(400).json({
        error: 'Cannot follow self',
        message: 'You cannot follow yourself'
      });
    }

    // Check if already following
    const isFollowing = req.user.following && req.user.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      req.user.following = req.user.following.filter(id => id.toString() !== targetUserId);
      targetUser.stats.followersCount = Math.max(0, targetUser.stats.followersCount - 1);
      req.user.stats.followingCount = Math.max(0, req.user.stats.followingCount - 1);
    } else {
      // Follow
      if (!req.user.following) req.user.following = [];
      req.user.following.push(targetUserId);
      targetUser.stats.followersCount += 1;
      req.user.stats.followingCount += 1;
    }

    await Promise.all([req.user.save(), targetUser.save()]);

    res.json({
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      following: !isFollowing
    });

  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      error: 'Failed to follow/unfollow user',
      message: error.message
    });
  }
});

// @route   GET /api/users/me/following
// @desc    Get users that current user is following
// @access  Private
router.get('/me/following', supabaseAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('following', 'firstName lastName profile verification stats');
    
    res.json({
      following: user.following || []
    });

  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      error: 'Failed to get following list',
      message: error.message
    });
  }
});

// @route   GET /api/users/me/followers
// @desc    Get users following current user
// @access  Private
router.get('/me/followers', supabaseAuth, async (req, res) => {
  try {
    const followers = await User.find({ following: req.user.id })
      .select('firstName lastName profile verification stats');
    
    res.json({
      followers
    });

  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      error: 'Failed to get followers list',
      message: error.message
    });
  }
});

module.exports = router; 