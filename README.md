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

## 👨‍💻 Author

**Raunak Agarwal**

---
