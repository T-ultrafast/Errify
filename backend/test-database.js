const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  'https://rvrsbczzadgcfmuftesd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cnNiY3p6YWRnY2ZtdWZ0ZXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTA4MTQsImV4cCI6MjA2OTMyNjgxNH0.ss1494060IuHo0roddrPgO7vug5TmL8IWfi4_l4nxWI'
);

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test posts table
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .limit(1);
    
    if (postsError) {
      console.error('Posts table error:', postsError);
    } else {
      console.log('✅ Posts table exists and accessible');
      console.log('Sample posts:', posts);
    }
    
    // Test profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('Profiles table error:', profilesError);
    } else {
      console.log('✅ Profiles table exists and accessible');
      console.log('Sample profiles:', profiles);
    }
    
    // Test comments table
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .limit(1);
    
    if (commentsError) {
      console.error('Comments table error:', commentsError);
    } else {
      console.log('✅ Comments table exists and accessible');
      console.log('Sample comments:', comments);
    }
    
    // Test likes table
    const { data: likes, error: likesError } = await supabase
      .from('likes')
      .select('*')
      .limit(1);
    
    if (likesError) {
      console.error('Likes table error:', likesError);
    } else {
      console.log('✅ Likes table exists and accessible');
      console.log('Sample likes:', likes);
    }
    
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

testDatabase(); 