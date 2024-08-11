import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import router from "./router.js"; // Ensure the router file is properly imported as an ES module

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const PORT = process.env.PORT || 5000;
const mongourl = process.env.DB_URL;

mongoose
  .connect(mongourl, {

  })
  .then(() => {
    console.log("Database is connected successfully");
  })
  .catch((err) => console.log(err));

// Set CORS options
const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

// Use routes
app.use('/', router);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Setup Socket.io
const io = new Server(server, {
  pingTimeout: 60000,
  transports: ["websocket"],
  cors: corsOptions,
});

// Socket connection
io.on("connection", (socket) => {
  console.log("Connected to socket.io:", socket.id);

  const setupHandler = (userId) => {
    if (!socket.hasJoined) {
      socket.join(userId);
      socket.hasJoined = true;
      console.log("User joined:", userId);
      socket.emit("connected");
    }
  };

  const newMessageHandler = (newMessageReceived) => {
    let chat = newMessageReceived?.chat;
    chat?.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      console.log("Message received by:", user._id);
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  };

  const joinChatHandler = (room) => {
    if (socket.currentRoom) {
      if (socket.currentRoom === room) {
        console.log(`User already in Room: ${room}`);
        return;
      }
      socket.leave(socket.currentRoom);
      console.log(`User left Room: ${socket.currentRoom}`);
    }
    socket.join(room);
    socket.currentRoom = room;
    console.log("User joined Room:", room);
  };

  const typingHandler = (room) => {
    socket.in(room).emit("typing");
  };

  const stopTypingHandler = (room) => {
    socket.in(room).emit("stop typing");
  };

  const clearChatHandler = (chatId) => {
    socket.in(chatId).emit("clear chat", chatId);
  };

  const deleteChatHandler = (chat, authUserId) => {
    chat.users.forEach((user) => {
      if (authUserId === user._id) return;
      console.log("Chat delete:", user._id);
      socket.in(user._id).emit("delete chat", chat._id);
    });
  };

  const chatCreateChatHandler = (chat, authUserId) => {
    chat.users.forEach((user) => {
      if (authUserId === user._id) return;
      console.log("Create chat:", user._id);
      socket.in(user._id).emit("chat created", chat);
    });
  };

  socket.on("setup", setupHandler);
  socket.on("new message", newMessageHandler);
  socket.on("join chat", joinChatHandler);
  socket.on("typing", typingHandler);
  socket.on("stop typing", stopTypingHandler);
  socket.on("clear chat", clearChatHandler);
  socket.on("delete chat", deleteChatHandler);
  socket.on("chat created", chatCreateChatHandler);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    socket.off("setup", setupHandler);
    socket.off("new message", newMessageHandler);
    socket.off("join chat", joinChatHandler);
    socket.off("typing", typingHandler);
    socket.off("stop typing", stopTypingHandler);
    socket.off("clear chat", clearChatHandler);
    socket.off("delete chat", deleteChatHandler);
    socket.off("chat created", chatCreateChatHandler);
  });
});
