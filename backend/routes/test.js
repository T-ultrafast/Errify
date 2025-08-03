const express = require('express');
const supabaseAuth = require('../middleware/supabaseAuth');

const router = express.Router();

// Test endpoint to verify Supabase authentication
router.get('/auth-test', supabaseAuth, async (req, res) => {
  try {
    res.json({
      message: 'Authentication successful!',
      user: {
        id: req.user.id,
        email: req.user.email,
        email_confirmed_at: req.user.email_confirmed_at
      },
      profile: req.profile
    });
  } catch (error) {
    res.status(500).json({
      error: 'Test failed',
      message: error.message
    });
  }
});

module.exports = router; 