const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors);
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.emit("test-event", "here is some data");
});

server.listen(3000, () => {
  console.log("server in port 3000");
});
