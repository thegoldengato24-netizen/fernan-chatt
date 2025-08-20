const socket = io();
let currentChat = "general";
let userName = localStorage.getItem("userName") || "Anonimo";

// Temas
document.body.className = localStorage.getItem("theme") || "blue";

const msgInput = document.getElementById("msg-input");
const sendBtn = document.getElementById("send-btn");
const messagesDiv = document.getElementById("messages");
const chatListDiv = document.getElementById("chat-list");
const fileInput = document.getElementById("file-input");

function renderMessage(data) {
  const div = document.createElement("div");
  div.textContent = `[${data.user}] ${data.type==='file'? data.message : data.message}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Enviar mensaje
sendBtn.addEventListener("click", () => {
  if(!msgInput.value) return;
  socket.emit("message", { chatId: currentChat, user: userName, message: msgInput.value, type:"text" });
  msgInput.value = "";
});

// Subida de archivos
fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/upload", { method:"POST", body: form });
  const data = await res.json();
  socket.emit("message", { chatId: currentChat, user: userName, message: data.originalname, type:"file" });
});

// Recibir mensajes
socket.on("message", renderMessage);

// Inicializar chats
socket.on("init", (chats) => {
  if(chats[currentChat]) chats[currentChat].forEach(renderMessage);
});
