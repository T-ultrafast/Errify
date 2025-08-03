const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Patent = require('../models/Patent');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/patents
// @desc    Create a new patent idea
// @access  Private
router.post('/', auth, [
  body('title')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Description must be between 50 and 5000 characters'),
  body('abstract')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Abstract must be between 20 and 1000 characters'),
  body('category')
    .isIn([
      'Technology', 'Medicine', 'Engineering', 'Chemistry', 'Physics',
      'Biology', 'Computer Science', 'Business', 'Agriculture', 'Other'
    ])
    .withMessage('Please select a valid category'),
  body('innovationDetails.problemSolved')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Problem solved must be between 20 and 1000 characters'),
  body('innovationDetails.solution')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Solution must be between 20 and 2000 characters'),
  body('innovationDetails.novelty')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Novelty must be between 20 and 1000 characters'),
  body('confidentiality.visibility')
    .optional()
    .isIn(['Public', 'Private', 'Semi-Private'])
    .withMessage('Please select a valid privacy level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      abstract,
      category,
      tags,
      media,
      innovationDetails,
      developmentStage,
      confidentiality,
      collaboration
    } = req.body;

    // Create new patent
    const patent = new Patent({
      author: req.user.id,
      title,
      description,
      abstract,
      category,
      tags: tags || [],
      media: media || {},
      innovationDetails,
      developmentStage: developmentStage || 'Concept',
      confidentiality: {
        ...confidentiality,
        visibility: confidentiality?.visibility || 'Public'
      },
      collaboration: {
        ...collaboration,
        isOpenToCollaboration: collaboration?.isOpenToCollaboration || true
      }
    });

    await patent.save();

    res.status(201).json({
      message: 'Patent idea created successfully',
      patent: patent.getPublicData()
    });

  } catch (error) {
    console.error('Create patent error:', error);
    res.status(500).json({
      error: 'Failed to create patent idea',
      message: error.message
    });
  }
});

// @route   GET /api/patents
// @desc    Get all patents with filtering and pagination
// @access  Public
router.get('/', [
  query('category')
    .optional()
    .isIn([
      'Technology', 'Medicine', 'Engineering', 'Chemistry', 'Physics',
      'Biology', 'Computer Science', 'Business', 'Agriculture', 'Other'
    ]),
  query('developmentStage')
    .optional()
    .isIn(['Concept', 'Prototype', 'Testing', 'Refinement', 'Patent Filed', 'Patent Granted']),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Search term must be at least 2 characters'),
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
    .isIn(['newest', 'oldest', 'mostLiked', 'mostCommented', 'highestRated'])
    .withMessage('Invalid sort option')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      category,
      developmentStage,
      search,
      page = 1,
      limit = 10,
      sort = 'newest'
    } = req.query;

    // Build filter query
    const filter = { 
      status: 'Active',
      'confidentiality.visibility': 'Public'
    };

    if (category) {
      filter.category = category;
    }

    if (developmentStage) {
      filter.developmentStage = developmentStage;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { abstract: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort query
    let sortQuery = {};
    switch (sort) {
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
      case 'mostLiked':
        sortQuery = { 'engagement.likes': -1 };
        break;
      case 'mostCommented':
        sortQuery = { 'feedback.comments': -1 };
        break;
      case 'highestRated':
        sortQuery = { 'feedback.ratings.overall.average': -1 };
        break;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get patents
    const patents = await Patent.find(filter)
      .populate('author', 'firstName lastName profile verification')
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Patent.countDocuments(filter);

    res.json({
      patents: patents.map(patent => patent.getPublicData()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get patents error:', error);
    res.status(500).json({
      error: 'Failed to get patents',
      message: error.message
    });
  }
});

// @route   GET /api/patents/:id
// @desc    Get a specific patent by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const patent = await Patent.findById(req.params.id)
      .populate('author', 'firstName lastName profile verification');

    if (!patent) {
      return res.status(404).json({
        error: 'Patent not found',
        message: 'Patent does not exist'
      });
    }

    if (patent.status !== 'Active') {
      return res.status(404).json({
        error: 'Patent not found',
        message: 'Patent is not available'
      });
    }

    // Check confidentiality
    if (patent.confidentiality.visibility === 'Private') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'This patent is private'
      });
    }

    // Increment view count
    patent.engagement.views += 1;
    await patent.save();

    res.json({
      patent: patent.getPublicData()
    });

  } catch (error) {
    console.error('Get patent error:', error);
    res.status(500).json({
      error: 'Failed to get patent',
      message: error.message
    });
  }
});

// @route   PUT /api/patents/:id
// @desc    Update a patent
// @access  Private
router.put('/:id', auth, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Description must be between 50 and 5000 characters'),
  body('category')
    .optional()
    .isIn([
      'Technology', 'Medicine', 'Engineering', 'Chemistry', 'Physics',
      'Biology', 'Computer Science', 'Business', 'Agriculture', 'Other'
    ])
    .withMessage('Please select a valid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const patent = await Patent.findById(req.params.id);

    if (!patent) {
      return res.status(404).json({
        error: 'Patent not found',
        message: 'Patent does not exist'
      });
    }

    // Check if user is the author
    if (patent.author.toString() !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only edit your own patents'
      });
    }

    // Update patent
    const updatedPatent = await Patent.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('author', 'firstName lastName profile verification');

    res.json({
      message: 'Patent updated successfully',
      patent: updatedPatent.getPublicData()
    });

  } catch (error) {
    console.error('Update patent error:', error);
    res.status(500).json({
      error: 'Failed to update patent',
      message: error.message
    });
  }
});

// @route   DELETE /api/patents/:id
// @desc    Delete a patent
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const patent = await Patent.findById(req.params.id);

    if (!patent) {
      return res.status(404).json({
        error: 'Patent not found',
        message: 'Patent does not exist'
      });
    }

    // Check if user is the author
    if (patent.author.toString() !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own patents'
      });
    }

    // Soft delete
    patent.status = 'Deleted';
    await patent.save();

    res.json({
      message: 'Patent deleted successfully'
    });

  } catch (error) {
    console.error('Delete patent error:', error);
    res.status(500).json({
      error: 'Failed to delete patent',
      message: error.message
    });
  }
});

// @route   POST /api/patents/:id/like
// @desc    Like/unlike a patent
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const patent = await Patent.findById(req.params.id);

    if (!patent) {
      return res.status(404).json({
        error: 'Patent not found',
        message: 'Patent does not exist'
      });
    }

    const existingLike = patent.engagement.likes.find(
      like => like.user.toString() === req.user.id
    );

    if (existingLike) {
      // Unlike
      await patent.removeLike(req.user.id);
      res.json({
        message: 'Patent unliked successfully',
        liked: false
      });
    } else {
      // Like
      await patent.addLike(req.user.id);
      res.json({
        message: 'Patent liked successfully',
        liked: true
      });
    }

  } catch (error) {
    console.error('Like patent error:', error);
    res.status(500).json({
      error: 'Failed to like/unlike patent',
      message: error.message
    });
  }
});

// @route   POST /api/patents/:id/comment
// @desc    Add a comment to a patent
// @access  Private
router.post('/:id/comment', auth, [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Comment must be between 1 and 2000 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('feedbackType')
    .optional()
    .isIn(['Technical', 'Legal', 'Business', 'General'])
    .withMessage('Please select a valid feedback type'),
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const patent = await Patent.findById(req.params.id);

    if (!patent) {
      return res.status(404).json({
        error: 'Patent not found',
        message: 'Patent does not exist'
      });
    }

    const { content, rating, feedbackType = 'General', isAnonymous = false } = req.body;

    await patent.addComment(req.user.id, content, rating, feedbackType, isAnonymous);

    res.json({
      message: 'Comment added successfully'
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      error: 'Failed to add comment',
      message: error.message
    });
  }
});

// @route   POST /api/patents/:id/collaborate
// @desc    Request collaboration on a patent
// @access  Private
router.post('/:id/collaborate', auth, [
  body('role')
    .isIn(['Developer', 'Tester', 'Investor', 'Marketer', 'Legal Advisor', 'Other'])
    .withMessage('Please select a valid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const patent = await Patent.findById(req.params.id);

    if (!patent) {
      return res.status(404).json({
        error: 'Patent not found',
        message: 'Patent does not exist'
      });
    }

    if (!patent.collaboration.isOpenToCollaboration) {
      return res.status(400).json({
        error: 'Collaboration not open',
        message: 'This patent is not open to collaboration'
      });
    }

    if (patent.collaboration.collaborators.length >= patent.collaboration.maxCollaborators) {
      return res.status(400).json({
        error: 'Collaboration full',
        message: 'Maximum number of collaborators reached'
      });
    }

    const { role } = req.body;

    await patent.requestCollaboration(req.user.id, role);

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

module.exports = router; 