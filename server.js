// Requiring modules
const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

// Importing formatMessage function
const formatMessage = require("./utils/messages");
// Importing users utils functions
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
} = require("./utils/users");

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
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        // Join room
        socket.join(user.room);

        socket.emit(
            "message",
            formatMessage(
                botName,
                `Welcome ${user.username} to ChatSpace room: ${user.room}!`
            )
        ); // sending message to the client that's connecting

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessage(botName, `${user.username} has joined the chat`)
            ); // sending message to all clients except the connecting client

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit(
                "message",
                formatMessage(botName, `${user.username} has left the chat`)
            );
            // Send users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});

// Setting server port
const PORT = process.env.PORT || 3000;

// Setting server to listen on port
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
