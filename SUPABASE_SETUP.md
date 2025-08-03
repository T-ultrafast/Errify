# Supabase Integration Setup for Errify

This guide will help you set up Supabase authentication and profile management for the Errify academic platform.

## 🚀 Quick Start

### 1. Supabase Project Already Created

The Supabase project has already been created with the following details:
- **Project URL**: `https://rvrsbczzadgcfmuftesd.supabase.co`
- **Project ID**: `rvrsbczzadgcfmuftesd`

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the **Anon/Public Key** (starts with `eyJ...`)
3. This key will be used as your `SUPABASE_KEY` environment variable

### 3. Configure Environment Variables

Create a `.env` file in the `frontend-vite` directory:

```bash
# Supabase Configuration
VITE_SUPABASE_KEY=your-supabase-anon-key-here

# Backend API URL (if needed)
VITE_API_URL=http://localhost:5001
```

**Important**: 
- Replace `your-supabase-anon-key-here` with your actual Supabase anon key from the dashboard
- In Vite, environment variables must be prefixed with `VITE_` to be accessible in the frontend

### 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-setup.sql`
3. Click "Run" to execute the SQL commands

This will create:
- ✅ `profiles` table with all required fields
- ✅ Row Level Security (RLS) policies
- ✅ Automatic profile creation on user signup
- ✅ Proper permissions and indexes

### 5. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure your site URL:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add `http://localhost:5173/login`
3. Go to **Authentication** → **Providers**
4. Enable **Email** provider
5. Optionally enable **Google** or **GitHub** for social logins

### 6. Test the Integration

1. Start your frontend development server:
   ```bash
   cd frontend-vite
   npm run dev
   ```

2. Navigate to `http://localhost:5173/register`
3. Create a new account
4. Verify that:
   - ✅ User account is created in Supabase Auth
   - ✅ Profile is automatically created in the `profiles` table
   - ✅ You can log in and access protected routes

## 🔧 Database Schema

### Profiles Table

```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    full_name TEXT,
    institution TEXT,
    field_of_study TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security Policies

- ✅ **Insert**: Users can only create their own profile
- ✅ **Select**: Users can only read their own profile
- ✅ **Update**: Users can only update their own profile
- ✅ **Delete**: Users can only delete their own profile

## 🔐 Security Features

### Authentication
- ✅ Email/password authentication
- ✅ Automatic session management
- ✅ Secure token handling
- ✅ Password reset functionality

### Profile Management
- ✅ Automatic profile creation on signup
- ✅ Profile data validation
- ✅ Secure profile updates
- ✅ Real-time profile synchronization

## 🛠️ API Functions

### Authentication Functions
```javascript
// Sign up with email and password
const { data, error } = await auth.signUp(email, password, profileData);

// Sign in with email and password
const { data, error } = await auth.signIn(email, password);

// Sign out
const { error } = await auth.signOut();

// Get current user
const { user, error } = await auth.getCurrentUser();
```

### Profile Functions
```javascript
// Get user profile
const { data, error } = await profiles.getProfile(userId);

// Update user profile
const { data, error } = await profiles.updateProfile(userId, updates);

// Create user profile
const { data, error } = await profiles.createProfile(profileData);
```

## 🎯 Features Implemented

### ✅ Authentication Setup
- [x] Email and password sign-up/login
- [x] Automatic user session management
- [x] Secure logout functionality
- [x] Auth state listening and synchronization

### ✅ Database Integration
- [x] Profiles table with all required fields
- [x] Row Level Security (RLS) policies
- [x] Automatic profile creation on signup
- [x] Profile update functionality

### ✅ Frontend Integration
- [x] Supabase client configuration
- [x] AuthContext with real authentication
- [x] Login component with error handling
- [x] Register component with profile creation
- [x] Navbar with authentication state
- [x] Protected route handling

### ✅ User Experience
- [x] Loading states during authentication
- [x] Error handling and user feedback
- [x] Toast notifications for success/error
- [x] Automatic navigation after login/logout
- [x] Profile icon with authentication state

## 🔍 Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Verify your `VITE_SUPABASE_KEY` is correct in the `.env` file
   - Check that the key starts with `eyJ`
   - Make sure the `.env` file is in the `frontend-vite` directory

2. **"process is not defined" error**
   - This happens when using `process.env` in Vite frontend
   - Use `import.meta.env.VITE_*` instead of `process.env.*`
   - Make sure environment variables are prefixed with `VITE_`

2. **"Table does not exist" error**
   - Run the SQL commands from `supabase-setup.sql`
   - Check that the `profiles` table was created

3. **"RLS policy violation" error**
   - Ensure RLS policies are properly set up
   - Check that the user is authenticated

4. **Profile not created on signup**
   - Verify the trigger function is created
   - Check the database logs for errors

### Debug Mode

Enable debug logging by adding to your `.env`:

```bash
REACT_APP_DEBUG=true
```

## 📚 Next Steps

1. **Add Social Authentication**
   - Configure Google OAuth
   - Configure GitHub OAuth
   - Update registration flow

2. **Enhance Profile Management**
   - Add profile picture upload
   - Add more profile fields
   - Create profile editing interface

3. **Add Email Verification**
   - Configure email templates
   - Add email verification flow
   - Handle unverified users

4. **Implement Password Reset**
   - Add password reset functionality
   - Create password reset UI
   - Handle password reset flow

## 🆘 Support

If you encounter any issues:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review the browser console for errors
3. Check the Supabase dashboard logs
4. Verify your environment variables are correct

---

**Note**: This setup provides a solid foundation for user authentication and profile management. The implementation follows Supabase best practices and includes proper security measures. 