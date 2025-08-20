cconst express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Carpeta pública
app.use(express.static(path.join(__dirname)));

// Parse JSON
app.use(express.json());

// Leer chats
const chatFile = path.join(__dirname, 'chats.json');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Obtener chats
app.get('/chats', (req, res) => {
  fs.readFile(chatFile, (err, data) => {
    if (err) return res.json([]);
    res.json(JSON.parse(data));
  });
});

// Guardar nuevo mensaje
app.post('/chats', (req, res) => {
  const newMessage = req.body;
  fs.readFile(chatFile, (err, data) => {
    let chats = [];
    if (!err) chats = JSON.parse(data);
    chats.push(newMessage);
    fs.writeFile(chatFile, JSON.stringify(chats, null, 2), (err) => {
      if (err) return res.status(500).send('Error guardando mensaje');
      res.json(newMessage);
    });
  });
});

// Servir index.html por cualquier otra ruta que no exista
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

