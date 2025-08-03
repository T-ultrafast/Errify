const express = require('express');
const { body, validationResult, query } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/resources
// @desc    Get all resources with filtering and pagination
// @access  Public
router.get('/', [
  query('category')
    .optional()
    .isIn(['Tutorial', 'Webinar', 'Document', 'Tool', 'Dataset', 'Paper', 'Other']),
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
    .withMessage('Limit must be between 1 and 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      category,
      search,
      page = 1,
      limit = 10
    } = req.query;

    // Mock data for now - in a real implementation, this would be a Resource model
    const mockResources = [
      {
        id: '1',
        title: 'How to Overcome Common Research Failures',
        description: 'A comprehensive guide to identifying and overcoming common research challenges',
        category: 'Tutorial',
        author: {
          id: 'user1',
          name: 'Dr. Sarah Johnson',
          institution: 'MIT'
        },
        url: 'https://example.com/tutorial1',
        tags: ['research', 'methodology', 'problem-solving'],
        createdAt: new Date('2024-01-15'),
        downloads: 1250,
        rating: 4.5
      },
      {
        id: '2',
        title: 'Patent Filing Process Explained',
        description: 'Step-by-step guide to filing patents for researchers and innovators',
        category: 'Document',
        author: {
          id: 'user2',
          name: 'Prof. Michael Chen',
          institution: 'Stanford University'
        },
        url: 'https://example.com/patent-guide',
        tags: ['patent', 'legal', 'innovation'],
        createdAt: new Date('2024-01-10'),
        downloads: 890,
        rating: 4.8
      },
      {
        id: '3',
        title: 'Research Collaboration Best Practices',
        description: 'Webinar recording on effective collaboration strategies in research',
        category: 'Webinar',
        author: {
          id: 'user3',
          name: 'Dr. Emily Rodriguez',
          institution: 'Harvard University'
        },
        url: 'https://example.com/webinar1',
        tags: ['collaboration', 'teamwork', 'research'],
        createdAt: new Date('2024-01-05'),
        downloads: 567,
        rating: 4.2
      }
    ];

    // Filter resources
    let filteredResources = mockResources;

    if (category) {
      filteredResources = filteredResources.filter(resource => resource.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredResources = filteredResources.filter(resource =>
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Calculate pagination
    const total = filteredResources.length;
    const skip = (page - 1) * limit;
    const paginatedResources = filteredResources.slice(skip, skip + parseInt(limit));

    res.json({
      resources: paginatedResources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      error: 'Failed to get resources',
      message: error.message
    });
  }
});

// @route   GET /api/resources/:id
// @desc    Get a specific resource by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Mock data - in real implementation, fetch from database
    const mockResource = {
      id: req.params.id,
      title: 'How to Overcome Common Research Failures',
      description: 'A comprehensive guide to identifying and overcoming common research challenges. This tutorial covers various scenarios where research projects might fail and provides practical solutions to prevent or recover from these failures.',
      category: 'Tutorial',
      author: {
        id: 'user1',
        name: 'Dr. Sarah Johnson',
        institution: 'MIT',
        expertise: 'Research Methodology'
      },
      url: 'https://example.com/tutorial1',
      tags: ['research', 'methodology', 'problem-solving', 'failure-recovery'],
      createdAt: new Date('2024-01-15'),
      downloads: 1250,
      rating: 4.5,
      reviews: [
        {
          id: 'review1',
          user: 'Dr. John Smith',
          rating: 5,
          comment: 'Excellent resource! Very practical and well-structured.',
          createdAt: new Date('2024-01-20')
        },
        {
          id: 'review2',
          user: 'Prof. Lisa Wang',
          rating: 4,
          comment: 'Great content, helped me avoid common pitfalls in my research.',
          createdAt: new Date('2024-01-18')
        }
      ],
      relatedResources: [
        {
          id: '2',
          title: 'Patent Filing Process Explained',
          category: 'Document'
        },
        {
          id: '3',
          title: 'Research Collaboration Best Practices',
          category: 'Webinar'
        }
      ]
    };

    if (!mockResource) {
      return res.status(404).json({
        error: 'Resource not found',
        message: 'Resource does not exist'
      });
    }

    res.json({
      resource: mockResource
    });

  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({
      error: 'Failed to get resource',
      message: error.message
    });
  }
});

// @route   POST /api/resources
// @desc    Upload a new resource
// @access  Private
router.post('/', auth, [
  body('title')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),
  body('category')
    .isIn(['Tutorial', 'Webinar', 'Document', 'Tool', 'Dataset', 'Paper', 'Other'])
    .withMessage('Please select a valid category'),
  body('url')
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      category,
      url,
      tags = []
    } = req.body;

    // Mock resource creation - in real implementation, save to database
    const newResource = {
      id: Date.now().toString(),
      title,
      description,
      category,
      author: {
        id: req.user.id,
        name: `${req.user.firstName} ${req.user.lastName}`,
        institution: req.user.profile.institution
      },
      url,
      tags,
      createdAt: new Date(),
      downloads: 0,
      rating: 0
    };

    res.status(201).json({
      message: 'Resource uploaded successfully',
      resource: newResource
    });

  } catch (error) {
    console.error('Upload resource error:', error);
    res.status(500).json({
      error: 'Failed to upload resource',
      message: error.message
    });
  }
});

// @route   POST /api/resources/:id/review
// @desc    Add a review to a resource
// @access  Private
router.post('/:id/review', auth, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be between 10 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;

    // Mock review creation - in real implementation, save to database
    const newReview = {
      id: Date.now().toString(),
      user: `${req.user.firstName} ${req.user.lastName}`,
      rating,
      comment,
      createdAt: new Date()
    };

    res.json({
      message: 'Review added successfully',
      review: newReview
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      error: 'Failed to add review',
      message: error.message
    });
  }
});

// @route   GET /api/resources/categories
// @desc    Get all resource categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      {
        name: 'Tutorial',
        description: 'Step-by-step guides and tutorials',
        count: 45
      },
      {
        name: 'Webinar',
        description: 'Recorded webinars and presentations',
        count: 23
      },
      {
        name: 'Document',
        description: 'Research papers, reports, and documents',
        count: 67
      },
      {
        name: 'Tool',
        description: 'Software tools and utilities',
        count: 34
      },
      {
        name: 'Dataset',
        description: 'Research datasets and data collections',
        count: 28
      },
      {
        name: 'Paper',
        description: 'Academic papers and publications',
        count: 89
      },
      {
        name: 'Other',
        description: 'Miscellaneous resources',
        count: 12
      }
    ];

    res.json({
      categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Failed to get categories',
      message: error.message
    });
  }
});

// @route   GET /api/resources/featured
// @desc    Get featured resources
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    // Mock featured resources
    const featuredResources = [
      {
        id: '1',
        title: 'How to Overcome Common Research Failures',
        description: 'A comprehensive guide to identifying and overcoming common research challenges',
        category: 'Tutorial',
        author: {
          name: 'Dr. Sarah Johnson',
          institution: 'MIT'
        },
        rating: 4.5,
        downloads: 1250
      },
      {
        id: '2',
        title: 'Patent Filing Process Explained',
        description: 'Step-by-step guide to filing patents for researchers and innovators',
        category: 'Document',
        author: {
          name: 'Prof. Michael Chen',
          institution: 'Stanford University'
        },
        rating: 4.8,
        downloads: 890
      },
      {
        id: '3',
        title: 'Research Collaboration Best Practices',
        description: 'Webinar recording on effective collaboration strategies in research',
        category: 'Webinar',
        author: {
          name: 'Dr. Emily Rodriguez',
          institution: 'Harvard University'
        },
        rating: 4.2,
        downloads: 567
      }
    ];

    res.json({
      featuredResources
    });

  } catch (error) {
    console.error('Get featured resources error:', error);
    res.status(500).json({
      error: 'Failed to get featured resources',
      message: error.message
    });
  }
});

module.exports = router; 