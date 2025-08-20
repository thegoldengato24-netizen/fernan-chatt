const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Carpeta de uploads
const upload = multer({ dest: "public/uploads/" });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Guardado de chats
const chatsFile = path.join(__dirname, "chats.json");
let chats = {};
if (fs.existsSync(chatsFile)) {
  chats = JSON.parse(fs.readFileSync(chatsFile, "utf-8"));
}

// Subida de archivos
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename, originalname: req.file.originalname });
});

// Socket.io
io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // Enviar chats existentes
  socket.emit("init", chats);

  // Nuevo mensaje
  socket.on("message", (data) => {
    const { chatId, user, message, type } = data;
    if (!chats[chatId]) chats[chatId] = [];
    chats[chatId].push({ user, message, type, timestamp: Date.now() });
    fs.writeFileSync(chatsFile, JSON.stringify(chats, null, 2));
    io.emit("message", { chatId, user, message, type, timestamp: Date.now() });
  });
});

server.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
