'use strict'

const http = require('http')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const axios = require('axios');
const url = 'http://api.olhovivo.sptrans.com.br/v2.1'

const OlhoVivo = require('olhovivo')

const token = 'f178380a3dd64fc801f25467748f4bbbeb8f37e501a7172318c637d75ed6d112'

const olhoVivo = new OlhoVivo({
  token: token
})

olhoVivo.authenticate('f178380a3dd64fc801f25467748f4bbbeb8f37e501a7172318c637d75ed6d112')

app.use(express.static(path.join(__dirname, 'public')))

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/:id', (req, res, next) => {
  module.exports = olhoVivo.linePositions('1100')
    .then(res => {
      const busLoc = {
        'Hora': res.hr,
        'Lat': res.vs[0].py,
        'Lng': res.vs[0].px
      }
      console.log(busLoc);
    })
    .catch(err => {
      console.log(err);
    })
})

server.listen(3000, err => {
  if (err) {
    throw err
  }
  console.log('server started on port 3000')
})
