const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  'https://rvrsbczzadgcfmuftesd.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key_here'
);

async function setupDatabase() {
  try {
    console.log('Setting up Supabase database...');

    // Create posts table
    const { error: postsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.posts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          author UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          title TEXT NOT NULL CHECK (char_length(title) >= 10 AND char_length(title) <= 200),
          content TEXT NOT NULL CHECK (char_length(content) >= 50 AND char_length(content) <= 10000),
          category TEXT NOT NULL CHECK (category IN (
            'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science',
            'Engineering', 'Medicine', 'Psychology', 'Economics', 'Business',
            'Arts', 'Literature', 'History', 'Philosophy', 'Other'
          )),
          tags TEXT[] DEFAULT '{}',
          media JSONB DEFAULT '{}',
          failure_details JSONB DEFAULT '{}',
          collaboration JSONB DEFAULT '{}',
          privacy JSONB DEFAULT '{"visibility": "Public", "allowComments": true, "allowSharing": true}',
          is_anonymous BOOLEAN DEFAULT false,
          engagement JSONB DEFAULT '{"likes": [], "comments": [], "shares": 0, "bookmarks": 0}',
          status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Resolved', 'Archived', 'Deleted')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (postsError) {
      console.error('Error creating posts table:', postsError);
    } else {
      console.log('✅ Posts table created');
    }

    // Create profiles table
    const { error: profilesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
          first_name TEXT,
          last_name TEXT,
          institution TEXT,
          bio TEXT,
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (profilesError) {
      console.error('Error creating profiles table:', profilesError);
    } else {
      console.log('✅ Profiles table created');
    }

    // Create likes table
    const { error: likesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.likes (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(post_id, user_id)
        );
      `
    });

    if (likesError) {
      console.error('Error creating likes table:', likesError);
    } else {
      console.log('✅ Likes table created');
    }

    // Create comments table
    const { error: commentsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.comments (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
          is_anonymous BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (commentsError) {
      console.error('Error creating comments table:', commentsError);
    } else {
      console.log('✅ Comments table created');
    }

    // Enable RLS on all tables
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
      `
    });

    if (rlsError) {
      console.error('Error enabling RLS:', rlsError);
    } else {
      console.log('✅ RLS enabled on all tables');
    }

    // Create RLS policies
    const { error: policiesError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Posts policies
        DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
        CREATE POLICY "Posts are viewable by everyone" ON public.posts
          FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Users can insert their own posts" ON public.posts;
        CREATE POLICY "Users can insert their own posts" ON public.posts
          FOR INSERT WITH CHECK (auth.uid() = author);

        DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
        CREATE POLICY "Users can update their own posts" ON public.posts
          FOR UPDATE USING (auth.uid() = author);

        DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
        CREATE POLICY "Users can delete their own posts" ON public.posts
          FOR DELETE USING (auth.uid() = author);

        -- Profiles policies
        DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
        CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
          FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
        CREATE POLICY "Users can insert their own profile" ON public.profiles
          FOR INSERT WITH CHECK (auth.uid() = id);

        DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
        CREATE POLICY "Users can update their own profile" ON public.profiles
          FOR UPDATE USING (auth.uid() = id);

        -- Likes policies
        DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.likes;
        CREATE POLICY "Likes are viewable by everyone" ON public.likes
          FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Users can insert their own likes" ON public.likes;
        CREATE POLICY "Users can insert their own likes" ON public.likes
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can delete their own likes" ON public.likes;
        CREATE POLICY "Users can delete their own likes" ON public.likes
          FOR DELETE USING (auth.uid() = user_id);

        -- Comments policies
        DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
        CREATE POLICY "Comments are viewable by everyone" ON public.comments
          FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Users can insert their own comments" ON public.comments;
        CREATE POLICY "Users can insert their own comments" ON public.comments
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
        CREATE POLICY "Users can update their own comments" ON public.comments
          FOR UPDATE USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
        CREATE POLICY "Users can delete their own comments" ON public.comments
          FOR DELETE USING (auth.uid() = user_id);
      `
    });

    if (policiesError) {
      console.error('Error creating policies:', policiesError);
    } else {
      console.log('✅ RLS policies created');
    }

    console.log('🎉 Database setup completed successfully!');

  } catch (error) {
    console.error('Database setup failed:', error);
  }
}

// Run the setup
setupDatabase(); 