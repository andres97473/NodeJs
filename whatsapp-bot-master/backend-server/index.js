require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const moment = require("moment");

const { request, response } = require("express");
const bodyParser = require("body-parser");

const { dbConnection } = require("./database/config");
const { check } = require("express-validator");
const {
  validarToken,
  validarTokenPrueba,
} = require("./middlewares/validar-token");
const { validarCampos } = require("./middlewares/validar-campos");

// constantes
const msg = "Chat iniciado!";
const formatDate = "DD/MM/YYYY hh:mm a";
const fech = moment().format(formatDate);
const inicioFech = msg + " " + fech;

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

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  },
});

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessfull
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("Client is ready!");

  listenMessage();

  // Funcion de prueba a mi propio numero
  setTimeout(() => {
    let chatId = `${process.env.NUMBER_CODE}${process.env.NUMBER_PHONE}@c.us`;

    client.sendMessage(chatId, inicioFech).then((response) => {
      if (response.id.fromMe) {
        console.log("It works! " + inicioFech);
        // correr app desde navegador
        // Abrir con navegador predeterminado
        // TODO: abrir con navegador predeterminado
        //c.exec("start http://localhost:3000/#/");
      }
    });
  }, 500);
});

/*
remover acentos
 */
const removeAccents = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

/*
Funcion se encarga de escuchar cada vez que un nuevo mensaje entra
 */
const listenMessage = () => {
  client.on("message", async (msg) => {
    //console.log("mensaje ", msg);
    const { from, to, body } = msg;

    if (from.includes("@c.us")) {
      //console.log("es mensaje");

      // sendMedia(from, "senado-vid.mp4");

      let msgRecibido = removeAccents(body);

      if (msgRecibido.includes("ping")) {
        sendMessage(from, "pong!!");
        // saveChatMongo(from, body);
      }
    } else {
      //console.log("no es mensaje");
    }
  });
};

/*
Funcion para enviar mensajes
 */
const sendMessage = (to, message) => {
  client.sendMessage(to, message);
};

// controladores mensajes

const sendMessagesPrueba = async (req, res = response) => {
  const numPrueba = req.numprueba;

  const { repeticiones, mensaje, token } = req.body;

  try {
    for (let index = 0; index < Number(repeticiones); index++) {
      const newNumber = `${process.env.NUMBER_CODE}${numPrueba}@c.us`;
      client.sendMessage(newNumber, mensaje);
    }

    res.json({
      ok: true,
      msg: `Mensajes enviado ${repeticiones}`,
      celular: numPrueba,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};

const sendMessagesToken = async (req, res = response) => {
  const { celulares, mensaje } = req.body;
  const disponibles = req.disponibles;
  const token_vence = req.vence;

  try {
    for (const celular of celulares) {
      const newNumber = `${process.env.NUMBER_CODE}${celular}@c.us`;
      client.sendMessage(newNumber, mensaje);
    }

    res.json({
      ok: true,
      msg: "Mensajes enviado",
      disponibles,
      token_vence,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};

// Rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/hospitales", require("./routes/hospitales"));
app.use("/api/medicos", require("./routes/medicos"));
app.use("/api/login", require("./routes/auth"));
app.use("/api/todo", require("./routes/busquedas"));
app.use("/api/upload", require("./routes/uploads"));
// Rutas Mensajes
app.post(
  "/api/send-message-token",
  [
    check("token", "El token debe ser valido").isMongoId(),
    check("celulares", "los numeros son obligatorios").not().isEmpty(),
    check("mensaje", "El mensaje es obligatorio").not().isEmpty(),
    validarCampos,
    validarToken,
  ],
  sendMessagesToken
);

app.post(
  "/api/send-message-prueba",
  [
    check("token", "El token debe ser valido").isMongoId(),
    check("mensaje", "El mensaje es obligatorio").not().isEmpty(),
    validarCampos,
    validarTokenPrueba,
  ],
  sendMessagesPrueba
);

// Validar error de diferentes rutas
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en el puerto ", process.env.PORT);
});
