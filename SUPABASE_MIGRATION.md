# Supabase Database Migration Guide

## 🚨 Important: Database Schema Update Required

The current profile fetching issue is caused by a mismatch between the database schema and the application code. The database still uses the old schema, but the application expects the new schema.

## 🔧 Migration Steps

### 1. Access Your Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your Errify project
3. Navigate to **SQL Editor**

### 2. Run the Updated Schema
Copy and paste the entire contents of `supabase-setup.sql` into the SQL Editor and click "Run".

This will:
- ✅ Drop the old profiles table
- ✅ Create the new profiles table with correct fields
- ✅ Set up proper RLS policies
- ✅ Create automatic profile creation trigger
- ✅ Add necessary indexes

### 3. Verify the Migration
After running the SQL, check that:
- ✅ The `profiles` table exists with the new schema
- ✅ All RLS policies are created
- ✅ The trigger function is set up

## 📋 New Schema Fields

The updated profiles table now includes:
- `id` (UUID, primary key)
- `first_name` (TEXT)
- `last_name` (TEXT)
- `email` (TEXT)
- `institution` (TEXT)
- `field` (TEXT)
- `linkedin` (TEXT)
- `researchgate` (TEXT)
- `orcid` (TEXT)
- `bio` (TEXT)
- `academic_record` (JSONB)
- `research` (JSONB)
- `social_links` (JSONB)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🧪 Testing After Migration

1. **Register a new account** - Should create profile automatically
2. **Login with existing account** - Should fetch profile correctly
3. **Check debug panel** - Should show "ProfID: [actual ID]" and "ProfName: [actual name]"
4. **Edit profile** - Should save changes correctly

## ⚠️ Important Notes

- **Existing users** will need to re-register or manually create profiles
- **Data migration** from old schema is not automatic
- **Backup your data** before running the migration if needed

## 🔍 Troubleshooting

If you still see "Profile Not Found" after migration:
1. Check browser console for errors
2. Verify the SQL ran successfully in Supabase
3. Try registering a new account to test
4. Use the "DB Check" button in debug panel 