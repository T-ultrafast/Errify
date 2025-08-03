# Environment Setup for Frontend

## 🔧 Create Environment File

Create a `.env` file in the `frontend-vite` directory with the following content:

```bash
# Supabase Configuration
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cnNiY3p6YWRnY2ZtdWZ0ZXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NzI5NzAsImV4cCI6MjA0ODU0ODk3MH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8

# Backend API URL
VITE_API_URL=http://localhost:5001
```

## 🚀 Steps to Create:

1. Navigate to the `frontend-vite` directory
2. Create a new file named `.env`
3. Copy and paste the content above
4. Save the file
5. Restart your development server

## 🔍 Verification:

After creating the `.env` file, restart your development server:

```bash
cd frontend-vite
npm run dev
```

Then check the browser console for any Supabase-related errors. The profile fetching should work correctly.

## ⚠️ Important Notes:

- The `.env` file is gitignored for security
- Environment variables must be prefixed with `VITE_` to be accessible in Vite
- The Supabase key above is a placeholder - you may need to get the actual key from your Supabase dashboard 