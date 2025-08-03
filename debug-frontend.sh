#!/bin/bash

echo "🔍 Debugging Frontend Issues"
echo "============================"

# Check if servers are running
echo "1. Checking server status..."
if curl -s http://localhost:5001/ > /dev/null 2>&1; then
    echo "✅ Backend server is running on port 5001"
else
    echo "❌ Backend server is not responding on port 5001"
fi

if curl -s http://localhost:5173/ > /dev/null 2>&1; then
    echo "✅ Frontend server is running on port 5173"
else
    echo "❌ Frontend server is not responding on port 5173"
fi

# Check for multiple Vite processes
echo ""
echo "2. Checking for multiple Vite processes..."
VITE_PROCESSES=$(ps aux | grep -i vite | grep -v grep | wc -l)
echo "Found $VITE_PROCESSES Vite processes"

if [ $VITE_PROCESSES -gt 1 ]; then
    echo "⚠️  Multiple Vite processes detected. Killing all Vite processes..."
    pkill -f "vite"
    sleep 2
fi

# Check for multiple Node server processes
echo ""
echo "3. Checking for multiple Node server processes..."
NODE_PROCESSES=$(ps aux | grep -i "node.*server.js" | grep -v grep | wc -l)
echo "Found $NODE_PROCESSES Node server processes"

if [ $NODE_PROCESSES -gt 1 ]; then
    echo "⚠️  Multiple Node server processes detected. Killing all Node server processes..."
    pkill -f "node.*server.js"
    sleep 2
fi

# Check environment variables
echo ""
echo "4. Checking environment variables..."
if [ -f "frontend-vite/.env" ]; then
    echo "✅ .env file exists in frontend-vite"
    if grep -q "VITE_SUPABASE_KEY" frontend-vite/.env; then
        echo "✅ VITE_SUPABASE_KEY is set"
    else
        echo "❌ VITE_SUPABASE_KEY is not set"
    fi
else
    echo "❌ .env file not found in frontend-vite"
fi

# Check for common errors in console
echo ""
echo "5. Checking for common build errors..."
if [ -d "frontend-vite/node_modules" ]; then
    echo "✅ node_modules exists"
else
    echo "❌ node_modules missing - run 'npm install' in frontend-vite"
fi

# Check package.json
echo ""
echo "6. Checking package.json..."
if [ -f "frontend-vite/package.json" ]; then
    echo "✅ package.json exists"
    if grep -q "vite" frontend-vite/package.json; then
        echo "✅ Vite is configured"
    else
        echo "❌ Vite not found in package.json"
    fi
else
    echo "❌ package.json not found"
fi

echo ""
echo "🎯 Debugging Complete!"
echo "If issues persist, check the browser console (F12) for JavaScript errors." 