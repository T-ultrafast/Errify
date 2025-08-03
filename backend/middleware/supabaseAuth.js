const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://rvrsbczzadgcfmuftesd.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cnNiY3p6YWRnY2ZtdWZ0ZXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTA4MTQsImV4cCI6MjA2OTMyNjgxNH0.ss1494060IuHo0roddrPgO7vug5TmL8IWfi4_l4nxWI'
);

const supabaseAuth = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token is not valid'
      });
    }

    // Check if user email is confirmed
    if (!user.email_confirmed_at) {
      return res.status(401).json({
        error: 'Email not verified',
        message: 'Please verify your email address'
      });
    }

    // Get user profile from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return res.status(401).json({
        error: 'Profile not found',
        message: 'User profile not found'
      });
    }

    // Add user and profile to request object
    req.user = user;
    req.profile = profile;
    next();

  } catch (error) {
    console.error('Supabase auth middleware error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: 'Server error during authentication'
    });
  }
};

module.exports = supabaseAuth; 