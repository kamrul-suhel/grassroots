var express = require('express');
var http = require('http')
var socketio = require('socket.io');
var socket = require('./socket');

var app = express();
var server = http.createServer(app);
var websocket = socketio(server);

server.listen(5001);
websocket.on('connection', socket);