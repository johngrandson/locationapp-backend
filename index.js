'use strict'

require('dotenv').config()
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const cors = require('cors')
const OlhoVivo = require('olhovivo')
const token = process.env.OLHOVIVO_TOKEN

const port = process.env.PORT || 3001;
const olhoVivo = new OlhoVivo({
  token: token
})

olhoVivo.authenticate(token)

app.use(cors());

let busLoc = {}, interval;

app.get('/lines', async (req, res) => {
  try {
    const lines = await olhoVivo.queryLines(req.query.busca);

    if (lines.length > 0) {
      res.send(lines);
    } else {
      res.json({ message: 'Nenhum resultado encontrado...' });
    }
    
  } catch (error) {
    console.log('error :', error);
  }
})

// Setting up a socket with the namespace "connection" for new sockets
io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  socket.on('send data', (id) => {
    interval = setInterval(() => getApiAndEmit(socket, id), 6000);
  });

  //A special namespace "disconnect" for when a client disconnects
  socket.on("disconnect", () => console.log("Client disconnected"));
});

const getApiAndEmit = async (socket, id) => {
  try {
    const geocoordinates = await olhoVivo.linePositions(id);
    console.log('geocoordinates', geocoordinates)
    
    if (geocoordinates.vs.length > 0) {
      busLoc = {  
        lat: geocoordinates.vs[0].py,
        lng: geocoordinates.vs[0].px,
      }
      socket.emit('outgoing data', busLoc);
    } else {
      socket.emit('outgoing data', 'No data');
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

server.listen(port, () => console.log(`Listening on port ${port}`));