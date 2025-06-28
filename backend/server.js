const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/dummy");
const { connect } = require("mongoose");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoute");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const path = require("path");
const cors = require("cors");
dotenv.config();

connectDB();
const app = express();

app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "https://convohub-8dos.onrender.com",
    ].filter(Boolean),
    credentials: true,
  })
);

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// -------------------------Deployment-----------

const dirname = path.resolve();
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(dirname, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running Sucessfully");
  });
}

// ---------------------------Deployment----------

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const server = app.listen(
  port,
  console.log(`Server started on port ${port}`.yellow.bold)
);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "https://convohub-8dos.onrender.com",
    ].filter(Boolean),
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.userId = userData._id; // Store user ID for typing indicators
    console.log("User joined room:", userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing", { room, userId: socket.userId });
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing", { room, userId: socket.userId });
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) {
      console.log("chat.users not defined");
      return;
    }

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) {
        return; // Don't send message back to sender
      }

      // Ensure user._id exists and is valid
      if (!user._id) {
        return;
      }

      // Emit to each user individually
      socket.to(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  // Handle disconnect properly
  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});
