#!/bin/bash

echo "🚀 Quick Fix for Supabase Integration Issues"
echo "============================================="

# 1. Install Supabase dependencies
echo "📦 Installing Supabase dependencies..."
cd backend && npm install @supabase/supabase-js
cd ../frontend-vite && npm install @supabase/supabase-js
cd ..

# 2. Create environment files
echo "🔧 Creating environment files..."

# Backend .env
cat > backend/.env << EOF
SUPABASE_URL=https://rvrsbczzadgcfmuftesd.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cnNiY3p6YWRnY2ZtdWZ0ZXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTA4MTQsImV4cCI6MjA2OTMyNjgxNH0.ss1494060IuHo0roddrPgO7vug5TmL8IWfi4_l4nxWI
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:5173
EOF

# Frontend .env
cat > frontend-vite/.env << EOF
VITE_SUPABASE_URL=https://rvrsbczzadgcfmuftesd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cnNiY3p6YWRnY2ZtdWZ0ZXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTA4MTQsImV4cCI6MjA2OTMyNjgxNH0.ss1494060IuHo0roddrPgO7vug5TmL8IWfi4_l4nxWI
VITE_API_URL=http://localhost:5001/api
EOF

echo "✅ Environment files created"

# 3. Run database setup
echo "🗄️ Setting up database schema..."
cd backend && node ../setup-supabase.js
cd ..

echo "🎉 Quick fix completed!"
echo ""
echo "Next steps:"
echo "1. Get your Supabase service role key from the dashboard"
echo "2. Update backend/.env with the service role key"
echo "3. Run: cd backend && npm run dev"
echo "4. Run: cd frontend-vite && npm run dev"
echo "5. Test the comment and like functionality" 