require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");

const { dbConnection } = require("./database/config");

// modelos
const Usuario = require("./models/usuario");

// Crear el servidor express
const app = express();

// Configurar CORS
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Carpeta publica
app.use(express.static("public"));

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/login", require("./routes/auth"));
app.use("/api/todo", require("./routes/busquedas"));
app.use("/api/upload", require("./routes/uploads"));
app.use("/api/notificaciones", require("./routes/notificaciones"));

// Validar error de diferentes rutas
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

// start server
const server = app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en el puerto ", process.env.PORT);
});

// inicializar socket.io pasando nuestro servior ya iniciado
// websockets

const SocketIO = require("socket.io");

// io es la coneccion entera con todos los clientes conectados
const io = SocketIO(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  const idHandShake = socket.id;
  const { email } = socket.handshake.query;

  socket.join(email);
  console.log("new connection ", idHandShake, " email ", email);

  socket.on("evento", async (resp) => {
    const admins = await Usuario.find(
      {
        role: "ADMIN_ROLE",
      },
      { email: 1, _id: 0 }
    );

    console.log(resp);
    for (const admin of admins) {
      socket.to(admin.email).emit("evento", resp);
    }
  });

  socket.on("solicitud:admin", (resp) => {
    console.log(resp);
    socket.to(resp.email).emit("solicitud:admin", resp);
  });
});
