# 🗄️ Database Setup Guide

## Prerequisites
- Supabase account (free tier available)
- Access to Supabase dashboard

## Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** to your account
3. **Create a new project**:
   - Click "New Project"
   - Choose your organization
   - Enter project name: `Errify`
   - Enter database password (save this!)
   - Choose region closest to you
   - Click "Create new project"

## Step 2: Get Your Project Credentials

1. **Go to Settings > API** in your Supabase dashboard
2. **Copy these values**:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

### Backend Environment
Create `.env` file in the `backend` directory:
```env
PORT=5001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=your_random_secret_string
```

### Frontend Environment
Create `.env` file in the `frontend-vite` directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:5001/api
```

## Step 4: Create Database Tables

1. **Go to SQL Editor** in your Supabase dashboard
2. **Click "New Query"**
3. **Copy and paste** the entire contents of `setup-database.sql`
4. **Click "Run"** to execute the script

This will create:
- ✅ `posts` table
- ✅ `profiles` table  
- ✅ `likes` table
- ✅ `comments` table
- ✅ `patents` table
- ✅ Row Level Security policies
- ✅ Indexes for performance
- ✅ Triggers for automatic timestamps

## Step 5: Verify Setup

After running the SQL script, you should see:
- ✅ All tables created successfully
- ✅ No error messages
- ✅ Tables appear in the "Table Editor"

## Step 6: Test the Application

1. **Start the backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend**:
   ```bash
   cd frontend-vite
   npm run dev
   ```

3. **Open your browser** to `http://localhost:5173`

## Troubleshooting

### Common Issues:

1. **"relation does not exist" error**
   - Make sure you ran the complete `setup-database.sql` script
   - Check that all tables were created in the Table Editor

2. **Authentication errors**
   - Verify your Supabase URL and keys are correct
   - Check that environment variables are properly set

3. **Connection refused**
   - Ensure your Supabase project is active
   - Check that your IP is not blocked

### Need Help?

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Verify all environment variables are set correctly
3. Ensure the database script ran without errors

## Next Steps

Once the database is set up:
1. ✅ Test user registration
2. ✅ Test post creation
3. ✅ Test comments and likes
4. ✅ Deploy to production

---

**🎉 Your Errify database is now ready!** 