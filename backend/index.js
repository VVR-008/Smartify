const bonjour = require('bonjour');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('Received message:', message);
  });
  ws.send('Hello, client!');
});

const bonjourInstance = bonjour();
bonjourInstance.publish({
  name: 'My WebSocket Server',
  type: 'websocket',
  port: 8080,
  host: 'backend.local'
});

app.get('/', (req, res) => {
  res.send('Welcome to My Web Server!');
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});

bonjourInstance.find({ type: 'websocket' }, (service) => { 
  console.log('Found a WebSocket server:', service);
});
