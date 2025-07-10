const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bonjour = require('bonjour');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const {handleConnection, messageEmitter} = require('./routes/socketMessages');
const { initializeSocketHandler } = require('./routes/socketMessages');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }));
app.use(bodyParser.json());
const server = http.createServer(app);
const bonjourInstance = bonjour();

bonjourInstance.publish({
  name: 'My WebSocket Server',
  type: 'websocket',
  port: 8080,
  host: 'backend.local'
});

const wss = new WebSocket.Server({server});

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the HTTP Server with Express!</h1>');
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

    bonjourInstance.publish({
      name: 'My HTTP Server',
      type: 'http',
      port: 8080,
      host: 'backend.local' 
    });
initializeSocketHandler(wss);
app.post('/modeldata', (req, res) => {
      const { voicetype, deviceid } = req.body;
      
      console.log('Received body:', req.body); 
      
      if (!voicetype || !deviceid) {
          console.log('Missing voicetype or deviceid');
          return res.status(400).send("Invalid message format. Required fields: voicetype, deviceid.");
      }
  
      messageEmitter.emit('modeldata', { voicetype, deviceid });
      res.status(200).send("Message received and forwarded to WebSocket server.");
});
app.use('/api',serviceRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);


wss.on('connection', (ws) => {
    handleConnection(ws, wss);
});



app.get('/api/devices/states', async (req, res) => {
  try {
    const devices = await DeviceModel.find(); // Fetch devices from your database
    res.json({ devices });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch device states' });
  }
});
app.get('/api/devices/states', async (req, res) => {
  try {
    const devices = await DeviceModel.find(); // Fetch devices from your database
    res.json({ devices });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch device states' });
  }
})



server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
bonjourInstance.find({ type: 'websocket' }, (service) => { 
    console.log('Found a WebSocket server:', service);
});