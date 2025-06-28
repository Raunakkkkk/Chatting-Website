# Deployment Guide for Render - ConvoHub

## Prerequisites

1. A Render account (free tier available)
2. A MongoDB database (MongoDB Atlas free tier recommended)
3. Your code pushed to a Git repository (GitHub, GitLab, etc.)

## Environment Variables Required

Set these environment variables in your Render dashboard:

### Single Service Environment Variables:

- `NODE_ENV`: `production`
- `PORT`: `10000`
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT token signing
- `CHAT_APP_URL`: `https://convohub-8dos.onrender.com`

### Frontend Environment Variables (for build time):

- `VITE_API_URL`: `https://convohub-8dos.onrender.com`
- `VITE_SOCKET_ENDPOINT`: `https://convohub-8dos.onrender.com`

## Frontend Configuration

The frontend is configured to work with the single service deployment:

1. **Socket.IO Endpoint**: Set to `https://convohub-8dos.onrender.com` for production
2. **API Calls**: Use relative paths (`/api/*`) which work with the same domain
3. **Build Process**: Frontend is built during the main build process

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub/GitLab**
2. **Connect your repository to Render**

   - Go to [render.com](https://render.com)
   - Click "New +" → "Blueprint"
   - Connect your Git repository
   - Render will automatically detect the `render.yaml` file

3. **Set Environment Variables**

   - In the Render dashboard, go to the service
   - Add the environment variables listed above

4. **Deploy**
   - Render will automatically build and deploy the service

### Option 2: Manual Deployment

#### Single Web Service:

1. Create a new Web Service named "convohub"
2. Connect your Git repository
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

## How It Works

This deployment uses a **single service approach** where:

- The **backend** serves the API endpoints at `/api/*`
- The **frontend** is built and served as static files from the same domain
- Both frontend and backend are accessible at `https://convohub-8dos.onrender.com`

### API Endpoints:

- User API: `https://convohub-8dos.onrender.com/api/user`
- Chat API: `https://convohub-8dos.onrender.com/api/chat`
- Message API: `https://convohub-8dos.onrender.com/api/message`

### Frontend:

- Main app: `https://convohub-8dos.onrender.com`

## Important Notes

1. **MongoDB Setup**: Use MongoDB Atlas for your database

   - Create a free cluster
   - Get your connection string
   - Add it to the `MONGODB_URI` environment variable

2. **CORS Configuration**: The backend is configured to accept requests from:

   - Local development URLs
   - `https://convohub-8dos.onrender.com`

3. **Socket.IO**: Real-time chat functionality will work on the same domain

4. **Build Process**:

   - The build command (`npm run build`) installs dependencies and builds the frontend
   - The start command (`npm start`) runs the backend server which also serves the frontend

5. **Frontend Environment**:

   - Socket.IO endpoint is hardcoded to production URL
   - API calls use relative paths for same-domain requests
   - No additional environment variables needed for frontend

6. **Free Tier Limitations**:

   - Service may sleep after 15 minutes of inactivity
   - Limited bandwidth and build minutes
   - Consider upgrading for production use

## Troubleshooting

1. **Build Failures**: Check the build logs in Render dashboard
2. **CORS Errors**: Since both frontend and backend are on the same domain, CORS issues should be minimal
3. **Database Connection**: Ensure MongoDB URI is correct and network access is configured
4. **Environment Variables**: Double-check all environment variables are set correctly
5. **Socket.IO Issues**: Verify the socket endpoint is correctly set in SingleChat.jsx

## URLs After Deployment

- **Single URL**: `https://convohub-8dos.onrender.com`
  - Frontend: `https://convohub-8dos.onrender.com`
  - Backend API: `https://convohub-8dos.onrender.com/api/*`

## Quick Deploy

1. **Create Web Service in Render**:

   - Name: "convohub"
   - Build Command: `npm run build`
   - Start Command: `npm start`

2. **Set Environment Variables**:

   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `CHAT_APP_URL`: `https://convohub-8dos.onrender.com`

3. **Deploy and Test**:

   - Your app will be available at `https://convohub-8dos.onrender.com`
