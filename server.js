const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos (HTML, CSS, JS, client.js, etc.)
app.use(express.static(path.join(__dirname, '/')));

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Puerto dinámico asignado por Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
