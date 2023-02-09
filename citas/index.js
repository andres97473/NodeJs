require("dotenv").config();

const path = require("path");
import express from "express";
const cors = require("cors");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia, List } = require("whatsapp-web.js");
const moment = require("moment");
const bodyParser = require("body-parser");

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

app.use(express.urlencoded({ extended: true }));

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");

  listenMessage();
});

client.initialize();

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
      let msgRecibido = removeAccents(body);

      if (msgRecibido.includes("ping")) {
        // sendMessage(from, "pong!!");
        // msg.reply("pong!!");
        client.sendMessage(from, "Pong!!");
      }
    } else {
      //console.log("no es mensaje");
    }
  });
};

// start server
const server = app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en el puerto ", process.env.PORT);
});
