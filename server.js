// var http = require('http');

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.end('Hello World!');
// }).listen(8080);

// console.log('hello')

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const morgan = require("morgan");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware to log requests
app.use(morgan("dev"));

// Middleware to authenticate users
app.use((req, res, next) => {
    // Here you can check for an auth token, for example
    const userAuthenticated = true; // Simplified authentication logic
    if (!userAuthenticated) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
});

// Serve static files (if any)
app.use(express.static("public"));

// Socket.io events
io.on("connection", (socket) => {
    console.log("New client connected");

    // Middleware-like function to log messages
    socket.on("chat message", (msg, sender) => {
        console.log(`Message received: ${msg} from ${sender}`);
        io.emit("chat message", msg, sender);  // Emit message to all clients
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
