require("dotenv").config();
const fs = require("fs");
const ExcelJS = require("exceljs");
const qrcode = require("qrcode-terminal");
const { Client, MessageMedia, Location } = require("whatsapp-web.js");
const moment = require("moment");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Path where the session data will be stored
const SESSION_FILE_PATH = "./session.json";
// Environment variables
const country_code = "52";
const number_code = "57";
const number = "3166651382";
const msg = "Hello World!";
const formatDate = "DD/MM/YYYY HH:mm";

// Load the session data if it has been previously saved
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
  session: sessionData,
});

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

// Save session values to the file upon successful auth
client.on("authenticated", (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
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
    let chatId = `${country_code}${number}@c.us`;
    client.sendMessage(chatId, msg).then((response) => {
      if (response.id.fromMe) {
        console.log("It works!");
      }
    });
  }, 3000);
});

/*
Funcion se encarga de escuchar cada vez que un nuevo mensaje entra
 */
const listenMessage = () => {
  client.on("message", (msg) => {
    //console.log("mensaje ", msg);
    const { from, to, body } = msg;

    if (from.includes("@c.us")) {
      //console.log("es mensaje");

      switch (removeAccents(body)) {
        case "info":
          sendMessage(from, "De que quieres informacion !!");
          break;
        case "adios":
          sendMessage(from, "Nos vemos pronto !!");
          break;
        case "hola":
          sendMessage(from, "Bienvenido !!");
          sendMedia(from, "curso-1.jpg");
          break;
      }

      saveChat(from, body);

      const today = moment().format(formatDate);

      console.log(from, to, body, today);
    } else {
      console.log("no es mensaje");
    }
  });
};

/* 
Funcion para enviar mensajes
 */
const sendMessage = (to, message) => {
  client.sendMessage(to, message);
};

/* 
Enviar media
 */
const sendMedia = (to, file) => {
  const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`);
  client.sendMessage(to, mediaFile);
};

/**
 * Guardar historial de conversacion
 * @param {*} number
 * @param {*} message
 */
const saveChat = async (number, message) => {
  const pathExcel = `./chats/${number}.xlsx`;
  const workbook = new ExcelJS.Workbook();
  const today = moment().format(formatDate);

  if (fs.existsSync(pathExcel)) {
    /**
     * Si existe el archivo de conversacion lo actualizamos
     */
    const workbook = new ExcelJS.Workbook();
    workbook.xlsx.readFile(pathExcel).then(() => {
      const worksheet = workbook.getWorksheet(1);
      const lastRow = worksheet.lastRow;
      var getRowInsert = worksheet.getRow(++lastRow.number);
      getRowInsert.getCell("A").value = today;
      getRowInsert.getCell("B").value = message;
      getRowInsert.commit();
      workbook.xlsx.writeFile(pathExcel);
    });
  } else {
    /**
     * NO existe el archivo de conversacion lo creamos
     */
    const worksheet = workbook.addWorksheet("Chats");
    worksheet.columns = [
      { header: "Fecha", key: "number_customer" },
      { header: "Mensajes", key: "message" },
    ];
    worksheet.addRow([today, message]);
    workbook.xlsx
      .writeFile(pathExcel)
      .then(() => {
        console.log("saved");
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
};

/* 
remover acentos
 */
const removeAccents = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

// constante app para iniciar express
const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded());

//app.use(express.urlencoded({ extended: true }));

// enviar mensaje con api
const sendWithApi = (req, res) => {
  const { message, to } = req.body;
  const newNumber = `${number_code}${to}@c.us`;
  console.log(message, to);

  sendMessage(newNumber, message);
  res.send({ status: "Mensajes Enviados !!", send: true });
};

app.post("/send", sendWithApi);

// LEVANTAR API
app.listen(9000, () => {
  console.log("API ESTA ARRIBA !!");
});
