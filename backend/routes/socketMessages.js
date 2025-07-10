const WebSocket = require('ws');
const EventEmitter = require('events');
let device = [];
const messageEmitter = new EventEmitter();
function handleConnection(ws, wss) {
  console.log('Client connected');
  ws.send('Welcome to the WebSocket server!');
  const cleanDeviceList = device.map(dev => ({
    deviceid: dev.deviceid,
    status: dev.status
  }));

  const deviceListMessage = JSON.stringify({ type: 'DEVICE_LIST', devices: cleanDeviceList });
  ws.send(deviceListMessage);

  ws.on('message', (message) => handleMessage(message, ws, wss));

  ws.on('close', () => handleClose(ws, wss));
}

let wssInstance;

function initializeSocketHandler(wss) {
  wssInstance = wss;
  messageEmitter.on('modeldata', (message) => {
    console.log('Received message from /modeldata:', message);
    handleMessage(JSON.stringify(message), null, wssInstance);
  });
}

function handleMessage(message, ws, wss) {
  console.log(`Received message from client: ${message}`);

  let messageStr = typeof message === 'string' ? message : message.toString();
  let parsedMessage;

  try {
    parsedMessage = JSON.parse(messageStr);
  } catch (error) {
    console.log('Invalid JSON message received:', messageStr);
    return;
  }

  if (parsedMessage.voicetype) {
    handleVoiceType(parsedMessage, wss);
    return;
  }

  switch (parsedMessage.type) {
    case 'DEVICE_LIST':
      handleDeviceList(parsedMessage, wss);
      break;
    case 'LIGHT_CONTROL':
      handleLightControl(parsedMessage, wss);
      break;
    case 'FAN_CONTROL':
      handleFanControl(parsedMessage, wss);
      break;
    case 'AC_CONTROL':
      handleACControl(parsedMessage, wss);
      break;
    case 'DEVICE_STATUS':
      handleDeviceStatus(parsedMessage, wss);
      break;
    default:
      console.log(`Unknown message type: ${parsedMessage.type}`);
      break;
  }
}

function handleVoiceType(parsedMessage, wss) {
  const { voicetype, deviceid } = parsedMessage;
  
  if (!voicetype || !deviceid) {
      console.log("Invalid voicetype or deviceid.");
      return;
  }
    switch (voicetype.toLowerCase()) {
      case 'lighton':
        handleLightControl({ deviceid, action: 'ON' }, wss);
        break;
      case 'lightoff':
        handleLightControl({ deviceid, action: 'OFF' }, wss);
      case 'fanon':
        handleFanControl({ deviceid, action: 'ON' }, wss);
          break;
      case 'fanoff':
        handleFanControl({ deviceid, action: 'OFF' }, wss);
            break;
      case'ac':
        handleACControl(parsedMessage,wss);
      
      default:
          console.log(`Unknown voicetype: ${voicetype}`);
          return;
  }
}

function handleDeviceList(parsedMessage, wss) {
  if (!parsedMessage || !parsedMessage.deviceid) {
    console.error("Device ID is missing in the message:", parsedMessage);
    return;
}

  const deviceId = parsedMessage.deviceid.trim();
  console.log("Handling device ID:", deviceId);
  const deviceIndex = device.findIndex(dev => dev.deviceid === deviceId);

  if (deviceIndex === -1) {
    device.push({ deviceid: deviceId, status: 'OFF' });
    console.log(`Device ${deviceId} added to the list.`);
  } else {
    console.log(`Device ${deviceId} is already in the list.`);
  }

  const updatedDeviceListMessage = JSON.stringify({
    type: 'DEVICE_LIST',
    devices: device.map(dev => ({
      deviceid: dev.deviceid,
      status: dev.status
    }))
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(updatedDeviceListMessage);
    }
  });
}


function handleLightControl(parsedMessage, wss) {
  const { deviceid, action } = parsedMessage;

  if (!deviceid || !action) {
    console.error("Invalid LIGHT_CONTROL message: Missing deviceid or action");
    return;
  }
  console.log('Broadcasting LIGHT Control to all clients');
  const status = action === "ON";

  const deviceIndex = device.findIndex(dev => dev.deviceid === deviceid);
  if (deviceIndex !== -1) {
    device[deviceIndex].status = status;
    device.push({ deviceid, status }); 
  }

  broadcastMessage(wss, 'LIGHT_CONTROL', deviceid, action);
}



function handleFanControl(parsedMessage, wss) {
  const { deviceid, action } = parsedMessage;

  if (!deviceid || !action) {
    console.error("Invalid FAN_CONTROL message: Missing deviceid or action");
    return;
  }
  console.log('Broadcasting FAN Control to all clients');
  const status = action === "ON";

  const deviceIndex = device.findIndex(dev => dev.deviceid === deviceid);
  if (deviceIndex !== -1) {
    device[deviceIndex].status = status;
    device.push({ deviceid, status }); 
  }
  broadcastMessage(wss, 'FAN_CONTROL', deviceid, action);
}

// function handleACControl(parsedMessage, wss) {
//   console.log('Broadcasting AC Control to all clients');
//   broadcastMessage(wss, 'AC_CONTROL', parsedMessage.deviceid);
// }
function handleACControl(parsedMessage, wss) {
  const { deviceid, action } = parsedMessage;

  if (!deviceid || !action) {
    console.error("Invalid AC_CONTROL message: Missing deviceid or action");
    return;
  }
  console.log('Broadcasting AC Control to all clients');
  const status = action === "ON";

  const deviceIndex = device.findIndex(dev => dev.deviceid === deviceid);
  if (deviceIndex !== -1) {
    device[deviceIndex].status = status;
    device.push({ deviceid, status }); 
  }
  broadcastMessage(wss, 'AC_CONTROL', deviceid, action);
}

function handleDeviceStatus(parsedMessage, wss) {
  const { deviceid, status, Ctype } = parsedMessage;
  console.log('Broadcasting Device Status to all clients');
  broadcastMessage(wss, 'DEVICE_STATUS', deviceid, null, status, Ctype)
}




function broadcastMessage(wss, type, deviceid, action = null, status = null, Ctype = null) {
  const message = { type, deviceid };
  if (action !== null) {
    message.action = action;
  }
  if (status !== null) {
    message.status = status; 
  }
  if (Ctype !== null) {
    message.Ctype = Ctype; 
  }
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function handleClose(ws, wss) {
  console.log('WebSocket connection closed');
  const index = device.findIndex(dev => dev.ws === ws);
  if (index !== -1) {
    device.splice(index, 1);
  }
  const updatedDeviceListMessage = JSON.stringify({
    type: 'DEVICE_LIST',
    devices: device.map(dev => ({
      deviceid: dev.deviceid,
      status: dev.status
    }))
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(updatedDeviceListMessage);
    }
  });
}

module.exports = {
  handleConnection,
  messageEmitter,
  initializeSocketHandler 
};
