// Requiring modules
const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

// Importing formatMessage function
const formatMessage = require("./utils/messages");

// Initializing express
const app = express();

// Initializing http server for socket.io
const server = http.createServer(app);

// Initialize socket.io
const io = socketio(server);

// Setting static resources directory
app.use(express.static(path.join(__dirname, "public")));

// Setting botName
const botName = "ChatSpace Bot";

// Run when a client connects
io.on("connection", (socket) => {
    // console.log("New WS connection");

    socket.emit("message", formatMessage(botName, "Welcome to ChatSpace!")); // sending message to the client that's connecting

    // Broadcast when a user connects
    socket.broadcast.emit(
        "message",
        formatMessage(botName, "A user has joined the chat")
    ); // sending message to all clients except the connecting client

    // Runs when client disconnects
    socket.on("disconnect", () =>
        io.emit("message", formatMessage(botName, "A user has left the chat"))
    );

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
        io.emit("message", formatMessage("user", msg));
    });
});

// Setting server port
const PORT = process.env.PORT || 3000;

// Setting server to listen on port
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
