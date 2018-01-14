const feathers = require("@feathersjs/feathers");
const socketio = require("@feathersjs/socketio-client");
const auth = require("@feathersjs/authentication-client");
const io = require("socket.io-client");

// Set up Socket.io client with the socket
const socket = io(process.env.socketServer, {
  transports: ["websocket"]
});
const feathersApp = feathers();
feathersApp
  .configure(socketio(socket))
  .configure(auth());

export default feathersApp;
