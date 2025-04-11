const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // React client runs on port 3000
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('join', ({ name, room }) => {
    socket.join(room);
    console.log(`${name} joined room: ${room}`);

    // Send welcome message to the user
    socket.emit('message', {
      user: 'admin',
      text: `Welcome ${name} to room ${room}!`,
    });

    // Notify others in the room
    socket.broadcast.to(room).emit('message', {
      user: 'admin',
      text: `${name} has joined the room.`,
    });

    // Save room and name on the socket object (optional for future use)
    socket.data.name = name;
    socket.data.room = room;
  });

  socket.on('sendMessage', (message, callback) => {
    const name = socket.data.name || 'User';
    const room = socket.data.room;

    if (room) {
      io.to(room).emit('message', {
        user: name,
        text: message,
      });
    }

    callback(); // clears the input on client side
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
