const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// Mock message storage - in real implementation, this would be a Message model
const mockMessages = new Map();
const mockConversations = new Map();

// @route   GET /api/messages/conversations
// @desc    Get user's conversations
// @access  Private
router.get('/conversations', auth, async (req, res) => {
  try {
    // Mock conversations data
    const conversations = [
      {
        id: 'conv1',
        participants: [
          {
            id: req.user.id,
            name: `${req.user.firstName} ${req.user.lastName}`,
            avatar: req.user.profile.avatar
          },
          {
            id: 'user2',
            name: 'Dr. Sarah Johnson',
            avatar: null
          }
        ],
        lastMessage: {
          content: 'Thanks for the collaboration offer!',
          sender: 'user2',
          timestamp: new Date('2024-01-20T10:30:00Z')
        },
        unreadCount: 2,
        createdAt: new Date('2024-01-15T09:00:00Z')
      },
      {
        id: 'conv2',
        participants: [
          {
            id: req.user.id,
            name: `${req.user.firstName} ${req.user.lastName}`,
            avatar: req.user.profile.avatar
          },
          {
            id: 'user3',
            name: 'Prof. Michael Chen',
            avatar: null
          }
        ],
        lastMessage: {
          content: 'I can help you with that research problem.',
          sender: req.user.id,
          timestamp: new Date('2024-01-19T14:20:00Z')
        },
        unreadCount: 0,
        createdAt: new Date('2024-01-10T11:00:00Z')
      }
    ];

    res.json({
      conversations
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      error: 'Failed to get conversations',
      message: error.message
    });
  }
});

// @route   GET /api/messages/conversations/:conversationId
// @desc    Get messages in a conversation
// @access  Private
router.get('/conversations/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Mock messages data
    const mockMessages = [
      {
        id: 'msg1',
        conversationId,
        sender: {
          id: req.user.id,
          name: `${req.user.firstName} ${req.user.lastName}`,
          avatar: req.user.profile.avatar
        },
        content: 'Hi! I saw your post about the research failure. I think I can help.',
        timestamp: new Date('2024-01-15T09:00:00Z'),
        isRead: true
      },
      {
        id: 'msg2',
        conversationId,
        sender: {
          id: 'user2',
          name: 'Dr. Sarah Johnson',
          avatar: null
        },
        content: 'That would be great! What specific expertise do you have?',
        timestamp: new Date('2024-01-15T09:05:00Z'),
        isRead: true
      },
      {
        id: 'msg3',
        conversationId,
        sender: {
          id: req.user.id,
          name: `${req.user.firstName} ${req.user.lastName}`,
          avatar: req.user.profile.avatar
        },
        content: 'I have experience in machine learning and data analysis. I can help with the statistical analysis part.',
        timestamp: new Date('2024-01-15T09:10:00Z'),
        isRead: true
      },
      {
        id: 'msg4',
        conversationId,
        sender: {
          id: 'user2',
          name: 'Dr. Sarah Johnson',
          avatar: null
        },
        content: 'Perfect! That\'s exactly what I need. Can we schedule a call to discuss the details?',
        timestamp: new Date('2024-01-15T09:15:00Z'),
        isRead: false
      },
      {
        id: 'msg5',
        conversationId,
        sender: {
          id: 'user2',
          name: 'Dr. Sarah Johnson',
          avatar: null
        },
        content: 'Thanks for the collaboration offer!',
        timestamp: new Date('2024-01-20T10:30:00Z'),
        isRead: false
      }
    ];

    // Calculate pagination
    const total = mockMessages.length;
    const skip = (page - 1) * limit;
    const paginatedMessages = mockMessages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(skip, skip + parseInt(limit))
      .reverse(); // Show oldest first

    res.json({
      messages: paginatedMessages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      error: 'Failed to get messages',
      message: error.message
    });
  }
});

// @route   POST /api/messages/conversations/:conversationId
// @desc    Send a message in a conversation
// @access  Private
router.post('/conversations/:conversationId', auth, [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { conversationId } = req.params;
    const { content } = req.body;

    // Mock message creation
    const newMessage = {
      id: Date.now().toString(),
      conversationId,
      sender: {
        id: req.user.id,
        name: `${req.user.firstName} ${req.user.lastName}`,
        avatar: req.user.profile.avatar
      },
      content,
      timestamp: new Date(),
      isRead: false
    };

    // In real implementation, save to database
    // await Message.create(newMessage);

    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      error: 'Failed to send message',
      message: error.message
    });
  }
});

// @route   POST /api/messages/conversations
// @desc    Create a new conversation
// @access  Private
router.post('/conversations', auth, [
  body('participantIds')
    .isArray({ min: 1 })
    .withMessage('At least one participant is required'),
  body('initialMessage')
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Initial message must be between 1 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { participantIds, initialMessage } = req.body;

    // Mock conversation creation
    const newConversation = {
      id: Date.now().toString(),
      participants: [
        {
          id: req.user.id,
          name: `${req.user.firstName} ${req.user.lastName}`,
          avatar: req.user.profile.avatar
        },
        // In real implementation, fetch participant details from database
        {
          id: participantIds[0],
          name: 'Dr. Sarah Johnson',
          avatar: null
        }
      ],
      lastMessage: initialMessage ? {
        content: initialMessage,
        sender: req.user.id,
        timestamp: new Date()
      } : null,
      unreadCount: 0,
      createdAt: new Date()
    };

    res.status(201).json({
      message: 'Conversation created successfully',
      conversation: newConversation
    });

  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      error: 'Failed to create conversation',
      message: error.message
    });
  }
});

// @route   PUT /api/messages/conversations/:conversationId/read
// @desc    Mark conversation as read
// @access  Private
router.put('/conversations/:conversationId/read', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;

    // In real implementation, update messages in database
    // await Message.updateMany(
    //   { conversationId, sender: { $ne: req.user.id } },
    //   { isRead: true }
    // );

    res.json({
      message: 'Conversation marked as read'
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      error: 'Failed to mark conversation as read',
      message: error.message
    });
  }
});

// @route   DELETE /api/messages/conversations/:conversationId
// @desc    Delete a conversation
// @access  Private
router.delete('/conversations/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;

    // In real implementation, soft delete conversation
    // await Conversation.findByIdAndUpdate(conversationId, { isDeleted: true });

    res.json({
      message: 'Conversation deleted successfully'
    });

  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({
      error: 'Failed to delete conversation',
      message: error.message
    });
  }
});

// @route   GET /api/messages/unread-count
// @desc    Get unread message count for current user
// @access  Private
router.get('/unread-count', auth, async (req, res) => {
  try {
    // Mock unread count
    const unreadCount = 5;

    res.json({
      unreadCount
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      error: 'Failed to get unread count',
      message: error.message
    });
  }
});

module.exports = router; 