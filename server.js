// Requiring modules
const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

// Initializing express
const app = express();

// Initializing http server for socket.io
const server = http.createServer(app);

// Initialize socket.io
const io = socketio(server);

// Setting static resources directory
app.use(express.static(path.join(__dirname, "public")));

// Run when a client connects
io.on("connection", (socket) => {
    console.log("New WS connection");
});

// Setting server port
const PORT = process.env.PORT || 3000;

// Setting server to listen on port
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
