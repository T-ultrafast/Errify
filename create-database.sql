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
ALTER TABLE public.patents ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX IF NOT EXISTS patents_title_idx ON public.patents(title);
CREATE INDEX IF NOT EXISTS patents_status_idx ON public.patents(status);
CREATE INDEX IF NOT EXISTS patents_created_at_idx ON public.patents(created_at DESC);

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