# ConvoHub - Real-Time Chat Application

A modern, full-stack real-time chatting application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring one-to-one and group chat functionality using Socket.IO.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using Socket.IO
- **One-to-One Chat**: Private conversations between users
- **Group Chat**: Create and manage group conversations
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Modern UI built with Tailwind CSS and DaisyUI
- **Dark/Light Theme**: Toggle between themes
- **Typing Indicators**: See when someone is typing
- **Message Notifications**: Get notified of new messages
- **User Profiles**: View and manage user information
- **Group Management**: Add/remove users from group chats

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend

- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **DaisyUI** - Component library
- **Socket.IO Client** - Real-time communication
- **Framer Motion** - Animations
- **React Router** - Navigation

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Chatting-Webstie
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CHAT_APP_URL=http://localhost:5173
   ```

4. **Run the application**

   ```bash
   # Start backend server
   npm run server

   # In another terminal, start frontend
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🚀 Deployment on Render

### Prerequisites

- Render account (free tier available)
- MongoDB Atlas database
- GitHub repository

### Deployment Steps

1. **Push your code to GitHub**

2. **Deploy using render.yaml (Recommended)**

   - Go to [render.com](https://render.com)
   - Click "New +" → "Blueprint"
   - Connect your Git repository
   - Render will automatically detect the `render.yaml` file

3. **Set Environment Variables in Render Dashboard**

   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   CHAT_APP_URL=https://your-app-name.onrender.com
   VITE_SOCKET_ENDPOINT=https://your-app-name.onrender.com
   ```

4. **Manual Deployment (Alternative)**
   - Create a new Web Service in Render
   - Name: "convohub"
   - Build Command: `npm install && cd frontend && npm install && npm run build`
   - Start Command: `npm start`
   - Add environment variables
   - Deploy

**Note**: The frontend builds to the `frontend/dist` directory (Vite's default), which is automatically served by the backend in production.

### Environment Variables

| Variable               | Description               | Example                         |
| ---------------------- | ------------------------- | ------------------------------- |
| `NODE_ENV`             | Environment mode          | `production`                    |
| `PORT`                 | Server port               | `10000`                         |
| `MONGODB_URI`          | MongoDB connection string | `mongodb+srv://...`             |
| `JWT_SECRET`           | JWT signing secret        | `your-secret-key`               |
| `CHAT_APP_URL`         | Application URL           | `https://your-app.onrender.com` |
| `VITE_SOCKET_ENDPOINT` | Socket.IO endpoint        | `https://your-app.onrender.com` |

## 🔧 API Endpoints

### Authentication

- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login

### Chats

- `GET /api/chat` - Get user chats
- `POST /api/chat` - Create new chat
- `PUT /api/chat/group` - Create group chat
- `PUT /api/chat/rename` - Rename group chat
- `PUT /api/chat/groupadd` - Add user to group
- `PUT /api/chat/groupremove` - Remove user from group

### Messages

- `GET /api/message/:chatId` - Get chat messages
- `POST /api/message` - Send message

### Users

- `GET /api/user?search=query` - Search users

## 🎨 Features in Detail

### Real-time Messaging

- Instant message delivery
- Typing indicators
- Message notifications
- Online/offline status

### Group Chat Management

- Create group chats
- Add/remove members
- Rename groups
- Group admin controls

### User Interface

- Responsive design
- Dark/light theme toggle
- Modern animations
- Intuitive navigation

## 🐛 Troubleshooting

### Build Issues

- **"vite: not found" Error**: Ensure build command includes frontend dependency installation
- **Build Failures**: Check Render build logs for specific errors

### Common Issues

- **CORS Errors**: Backend is configured for same-domain requests
- **Database Connection**: Verify MongoDB URI and network access
- **Socket.IO Issues**: Check environment variables and CORS configuration

### Alternative Build Commands

If the main build command fails, try:

```
Build Command: npm run install-all && cd frontend && npm run build
```

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Search Users**: Find users to chat with
3. **Start Chat**: Begin one-to-one or group conversations
4. **Real-time Messaging**: Send and receive messages instantly
5. **Manage Groups**: Create and manage group chats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Raunak Agarwal**

---

**Note**: This application is designed for educational and personal use. For production deployment, consider security best practices and proper error handling.
