# 🔍 Frontend Debugging Guide

## Quick Fixes

### 1. **Blank Page Issue**
If the frontend shows a blank page:

```bash
# Kill all processes and restart
pkill -f "vite" && pkill -f "node.*server.js"
cd frontend-vite && npm run dev
cd ../backend && npm start
```

### 2. **Multiple Server Processes**
If you see port conflicts:

```bash
# Run the debugging script
./debug-frontend.sh
```

### 3. **Authentication Issues**
If login doesn't work:

1. Check browser console (F12) for errors
2. Verify `.env` file has `VITE_SUPABASE_KEY`
3. Check the debug info panel (bottom-right in development)

## 🔧 **Debugging Components**

### ErrorBoundary
- Catches React rendering errors
- Shows fallback UI when components crash
- Displays error details in development

### DebugInfo Panel
- Shows authentication state
- Displays current route
- Only visible in development mode

### LoadingSpinner
- Provides visual feedback during loading
- Used in ProtectedRoute and other components

## 🚨 **Common Issues & Solutions**

### Issue: "process is not defined"
**Solution**: Use `import.meta.env` instead of `process.env` in Vite

### Issue: Multiple Vite servers
**Solution**: Run `pkill -f "vite"` before starting

### Issue: Authentication state not updating
**Solution**: Check browser console for auth errors

### Issue: Protected routes redirecting to login
**Solution**: Verify Supabase configuration and user session

## 📊 **Debugging Steps**

1. **Check Server Status**
   ```bash
   curl http://localhost:5173/
   curl http://localhost:5001/
   ```

2. **Check Browser Console**
   - Press F12 → Console
   - Look for JavaScript errors
   - Check authentication logs

3. **Check Network Tab**
   - Press F12 → Network
   - Look for failed requests
   - Check API responses

4. **Check Environment Variables**
   ```bash
   cat frontend-vite/.env
   ```

5. **Check Build Errors**
   ```bash
   cd frontend-vite && npm run build
   ```

## 🎯 **Prevention**

### Error Boundaries
- Wrap main components in ErrorBoundary
- Prevents silent failures
- Provides user-friendly error messages

### Better Logging
- Console logs in key components
- Authentication state tracking
- Route change monitoring

### Development Tools
- Debug info panel
- Loading states
- Error fallbacks

## 🚀 **Quick Start**

1. **Start servers cleanly**:
   ```bash
   ./debug-frontend.sh
   cd frontend-vite && npm run dev
   cd ../backend && npm start
   ```

2. **Open browser**:
   - Go to `http://localhost:5173/`
   - Open DevTools (F12)
   - Check console for errors

3. **Test authentication**:
   - Try logging in
   - Check debug panel
   - Monitor console logs

## 📝 **Logging Locations**

- **main.jsx**: Application initialization
- **App.jsx**: Component rendering
- **AuthContext.jsx**: Authentication state changes
- **ProtectedRoute.jsx**: Route protection logic
- **Login.jsx**: Login attempts and results

## 🔄 **Troubleshooting Flow**

1. **Blank page** → Check ErrorBoundary
2. **Login issues** → Check AuthContext logs
3. **Route problems** → Check ProtectedRoute
4. **Build errors** → Check console and network
5. **Server conflicts** → Run debug script

## 📞 **Getting Help**

If issues persist:
1. Check browser console (F12)
2. Run `./debug-frontend.sh`
3. Check this guide
4. Look for error messages in terminal 