import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import http from "http";
import socketIo from "socket.io";
import Message from "./models/messages"; // modèle mongoose à adapter
import { deleteMessage } from "./routes/messages"; 

dotenv.config();

const app = express();
const PING_URL = "https://fast-chat-eight.vercel.app"; // Votre backend Render

setInterval(() => {
  fetch(PING_URL)
    .then((res) => {
      if (res.ok) {
        console.log("Ping successful");
      } else {
        console.error("Ping failed with status:", res.status);
      }
    })
    .catch((err) => console.error("Ping failed:", err));
}, 600000); // Toutes les 10 minutes (600000ms)

const allowedOrigins = [
  "http://localhost:3000",      // pour test local
  "http://localhost:3003",      // autre port local
  "https://fast-chat-eight.vercel.app" // frontend déployé
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());



const server = http.createServer(app);

// Set up Socket.IO with the HTTP server
const io = new socketIo.Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

io.on("connection", (socket) => {
  console.log("New user connected");

  // Envoyer l'historique
  Message.find().sort({ createdAt: 1 }).limit(100).then((messages) => {
    socket.emit("messageHistory", messages);
  });

  // Nouveau message
  socket.on("message", async (msg) => {
    console.log("Received message: ", msg);

    try {
      const savedMsg = await Message.create(msg);
      io.emit("message", savedMsg);
    } catch (err) {
      console.error("Erreur MongoDB :", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});



app.use("/auth", authRoutes);
app.delete("/deletemessage/:id", deleteMessage);


mongoose.connect(process.env.MONGO_URI as string).then(() => {
  server.listen(process.env.PORT, () => {
    console.log("API + Socket.IO running on http://localhost:" + process.env.PORT);
  });
});