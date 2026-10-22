const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

const jugadores = {};

io.on('connection', (socket) => {
  console.log('Jugador conectado:', socket.id);

  jugadores[socket.id] = { x: 100, y: 100 };
  io.emit('actualizarJugadores', jugadores);

  socket.on('mover', (datos) => {
    if (jugadores[socket.id]) {
      jugadores[socket.id].x = datos.x;
      jugadores[socket.id].y = datos.y;
      socket.broadcast.emit('jugadorMovido', { id: socket.id, x: datos.x, y: datos.y });
    }
  });

  socket.on('disconnect', () => {
    delete jugadores[socket.id];
    io.emit('actualizarJugadores', jugadores);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));