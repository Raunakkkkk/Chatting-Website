# URL Change Guide - ConvoHub

## Overview

If you need to change your deployment URL (e.g., from `https://convohub-8dos.onrender.com` to a different URL), here's exactly what you need to update:

## Files That Need URL Updates

### 1. **render.yaml** (Main Configuration)

```yaml
services:
  - type: web
    name: convohub
    env: node
    plan: free
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: CHAT_APP_URL
        sync: false # Set this in Render dashboard
      - key: VITE_SOCKET_ENDPOINT
        sync: false # Set this in Render dashboard
```

### 2. **backend/server.js** (CORS Configuration)

```javascript
// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "https://your-new-url.onrender.com", // Update this
    ].filter(Boolean),
    credentials: true,
  })
);

// Socket.IO CORS
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "https://your-new-url.onrender.com", // Update this
    ].filter(Boolean),
    credentials: true,
  },
});
```

### 3. **frontend/src/components/SingleChat.jsx** (Socket Endpoint)

```javascript
const ENDPOINT =
  import.meta.env.VITE_SOCKET_ENDPOINT || "http://localhost:5000";
```

## Environment Variables to Set in Render Dashboard

When you change your URL, update these environment variables in your Render dashboard:

### Required Environment Variables:

- `CHAT_APP_URL`: `https://your-new-url.onrender.com`
- `VITE_SOCKET_ENDPOINT`: `https://your-new-url.onrender.com`

### Optional (if you want to override defaults):

- `NODE_ENV`: `production`
- `PORT`: `10000`
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret

## Step-by-Step URL Change Process

### Option 1: Update Existing Deployment

1. **Update Code Files**:

   - Update `backend/server.js` with new URL in CORS configuration
   - Update `frontend/src/components/SingleChat.jsx` if needed (usually not required)

2. **Update Render Environment Variables**:

   - Go to your Render dashboard
   - Navigate to your service
   - Go to Environment tab
   - Update `CHAT_APP_URL` to your new URL
   - Update `VITE_SOCKET_ENDPOINT` to your new URL

3. **Redeploy**:
   - Push your updated code to GitHub
   - Render will automatically redeploy

### Option 2: Create New Deployment

1. **Update All Files**:

   - Update `render.yaml` (if using blueprint)
   - Update `backend/server.js` CORS configuration
   - Update any hardcoded URLs

2. **Create New Service**:
   - Create new Web Service in Render
   - Set environment variables with new URL
   - Deploy

## URL Change Scenarios

### Scenario 1: Different Render Subdomain

**From**: `https://convohub-8dos.onrender.com`
**To**: `https://my-chat-app.onrender.com`

**Changes Needed**:

- Update CORS in `backend/server.js`
- Update environment variables in Render dashboard

### Scenario 2: Custom Domain

**From**: `https://convohub-8dos.onrender.com`
**To**: `https://mychatapp.com`

**Changes Needed**:

- Update CORS in `backend/server.js`
- Update environment variables in Render dashboard
- Configure custom domain in Render

### Scenario 3: Different Platform

**From**: `https://convohub-8dos.onrender.com`
**To**: `https://myapp.herokuapp.com`

**Changes Needed**:

- Update CORS in `backend/server.js`
- Update environment variables
- Adjust deployment configuration for new platform

## Quick URL Change Checklist

- [ ] Update `backend/server.js` CORS origins
- [ ] Update `render.yaml` (if using blueprint)
- [ ] Set `CHAT_APP_URL` environment variable in Render
- [ ] Set `VITE_SOCKET_ENDPOINT` environment variable in Render
- [ ] Test API endpoints with new URL
- [ ] Test Socket.IO connection with new URL
- [ ] Test frontend functionality

## Testing After URL Change

1. **API Endpoints**:

   ```
   https://your-new-url.onrender.com/api/user
   https://your-new-url.onrender.com/api/chat
   https://your-new-url.onrender.com/api/message
   ```

2. **Frontend**:

   ```
   https://your-new-url.onrender.com
   ```

3. **Socket.IO**:
   - Check browser console for connection errors
   - Test real-time messaging functionality

## Common Issues and Solutions

### Issue: CORS Errors

**Solution**: Update CORS origins in `backend/server.js`

### Issue: Socket.IO Connection Failed

**Solution**: Check `VITE_SOCKET_ENDPOINT` environment variable

### Issue: API Calls Failing

**Solution**: Verify `CHAT_APP_URL` environment variable

### Issue: Frontend Not Loading

**Solution**: Check build logs and ensure all environment variables are set

## Pro Tips

1. **Use Environment Variables**: Always use environment variables instead of hardcoding URLs
2. **Test Locally**: Test with new URLs in development before deploying
3. **Backup Configuration**: Keep a backup of your working configuration
4. **Gradual Rollout**: Consider testing with a staging environment first
5. **Monitor Logs**: Check Render logs after URL changes for any issues
