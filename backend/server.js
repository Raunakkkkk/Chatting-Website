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
dotenv.config();

connectDB();
const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// -------------------------Deployment-----------

const dirname = path.resolve();
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(dirname, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(dirname, "frontend", "build", "index.html"));
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
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) {
        console.log("kcuh to gadbad hai");
        return;
      }

      socket.in(chat._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
