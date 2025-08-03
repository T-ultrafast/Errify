-- Complete Database Setup for Errify
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create posts table
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

-- Create profiles table
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

-- Create likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patents table
CREATE TABLE IF NOT EXISTS public.patents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  abstract TEXT,
  inventors TEXT[] DEFAULT '{}',
  assignee TEXT,
  patent_number TEXT,
  filing_date DATE,
  publication_date DATE,
  status TEXT DEFAULT 'Active',
  claims TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.likes;
DROP POLICY IF EXISTS "Users can insert their own likes" ON public.likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON public.likes;

DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
DROP POLICY IF EXISTS "Users can insert their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

DROP POLICY IF EXISTS "Patents are viewable by everyone" ON public.patents;
DROP POLICY IF EXISTS "Users can insert patents" ON public.patents;
DROP POLICY IF EXISTS "Users can update patents" ON public.patents;
DROP POLICY IF EXISTS "Users can delete patents" ON public.patents;

-- Create RLS policies for posts
CREATE POLICY "Posts are viewable by everyone" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author);

CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = author);

CREATE POLICY "Users can delete their own posts" ON public.posts
  FOR DELETE USING (auth.uid() = author);

-- Create RLS policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for likes
CREATE POLICY "Likes are viewable by everyone" ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON public.likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for comments
CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for patents
CREATE POLICY "Patents are viewable by everyone" ON public.patents
  FOR SELECT USING (true);

CREATE POLICY "Users can insert patents" ON public.patents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update patents" ON public.patents
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete patents" ON public.patents
  FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS posts_author_idx ON public.posts(author);
CREATE INDEX IF NOT EXISTS posts_category_idx ON public.posts(category);
CREATE INDEX IF NOT EXISTS posts_status_idx ON public.posts(status);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS posts_tags_idx ON public.posts USING GIN(tags);

CREATE INDEX IF NOT EXISTS likes_post_id_idx ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON public.likes(user_id);

CREATE INDEX IF NOT EXISTS comments_post_id_idx ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments(created_at DESC);

CREATE INDEX IF NOT EXISTS patents_title_idx ON public.patents(title);
CREATE INDEX IF NOT EXISTS patents_status_idx ON public.patents(status);
CREATE INDEX IF NOT EXISTS patents_created_at_idx ON public.patents(created_at DESC);

-- Create function for automatic updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;
CREATE TRIGGER update_comments_updated_at 
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample data for testing
INSERT INTO public.posts (author, title, content, category, tags, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Quantum Computing Breakthrough', 'Successfully implemented a new quantum algorithm that reduces computation time by 50%. The approach uses novel entanglement techniques...', 'Computer Science', ARRAY['quantum', 'computing', 'algorithm'], 'Active'),
  ('00000000-0000-0000-0000-000000000002', 'CRISPR Gene Editing Success', 'Successfully edited genes in human cells with 99% accuracy using improved CRISPR-Cas9 technique. This opens new possibilities for genetic therapy...', 'Biology', ARRAY['CRISPR', 'gene-editing', 'therapy'], 'Active'),
  ('00000000-0000-0000-0000-000000000003', 'Renewable Energy Storage Solution', 'Developed a new battery technology that stores renewable energy with 90% efficiency. This could revolutionize the energy sector...', 'Engineering', ARRAY['renewable', 'energy', 'battery'], 'Active'),
  ('00000000-0000-0000-0000-000000000004', 'Machine Learning Model Failure', 'Attempted to create a predictive model for stock prices but failed due to overfitting. The model performed well on training data but poorly on test data...', 'Computer Science', ARRAY['machine-learning', 'failure', 'overfitting'], 'Active')
ON CONFLICT DO NOTHING;

-- Insert sample profiles
INSERT INTO public.profiles (id, first_name, last_name, institution, bio) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Alice', 'Johnson', 'MIT', 'Quantum Computing Researcher'),
  ('00000000-0000-0000-0000-000000000002', 'Bob', 'Smith', 'Stanford', 'Genetic Engineering Specialist'),
  ('00000000-0000-0000-0000-000000000003', 'Carol', 'Davis', 'CalTech', 'Energy Systems Engineer'),
  ('00000000-0000-0000-0000-000000000004', 'David', 'Wilson', 'Harvard', 'Machine Learning Scientist')
ON CONFLICT DO NOTHING; 