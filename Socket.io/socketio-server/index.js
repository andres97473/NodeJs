const path = require("path");
const express = require("express");
const app = express();

// settings
app.set("port", process.env.PORT || 3000);

// static files

app.use(express.static(path.join(__dirname, "public")));

// start server
const server = app.listen(app.get("port"), () => {
  console.log("server on port ", app.get("port"));
});

// inicializar socket.io pasando nuestro servior ya iniciado
// websockets

const SocketIO = require("socket.io");
// io es la coneccion entera con todos los clientes conectados
const io = SocketIO(server);

io.on("connection", (socket) => {
  console.log("new connection", socket.id);
  socket.on("chat:message", (data) => {
    // console.log(data);
    io.sockets.emit("chat:message", data);
  });

  socket.on("chat:typing", (data) => {
    // emitir data (username) a todos menos a mi
    socket.broadcast.emit("chat:typing", data);
  });
});
