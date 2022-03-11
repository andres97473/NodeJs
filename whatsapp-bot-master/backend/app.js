require("dotenv").config();
const fs = require("fs");
const ExcelJS = require("exceljs");
const qrcode = require("qrcode-terminal");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const moment = require("moment");
const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser");

// Environment variables

// const country_code = "52";
const PORT = 9000;
const number_code = "57";
const number = "3166651382";
const msg = "Chat iniciado!";
const formatDate = "DD/MM/YYYY hh:mm a";
const fech = moment().format(formatDate);
const inicioFech = msg + " " + fech;

// constante app para iniciar express
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const client = new Client({
  authStrategy: new LocalAuth(),
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
    let chatId = `${number_code}${number}@c.us`;

    client.sendMessage(chatId, inicioFech).then((response) => {
      if (response.id.fromMe) {
        console.log("It works! " + inicioFech);
      }
    });
  }, 1000);
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
        case "consulta":
          sendMessage(
            from,
            "Estimado potositano vota por nuestra formula partido de la U con Berner Zambarano al senado con el número 99 y Teresa Enriquez a la cámara con el número 101.\nPara más información de como votar escribe *senado* o *camara*"
          );
          break;
        case "senado":
          sendMessage(
            from,
            "Berner Zambrano, vota al senado partido de la U marcando una X sobre el numero 99"
          );
          sendMedia(from, "senado.jpg");
          break;
        case "camara":
          sendMessage(
            from,
            "Teresa Enriquez, vota a la camara partido de la U marcando una X sobre el numero 101"
          );
          sendMedia(from, "camara.jpg");
          break;
      }

      // saveChatExcel(from, body);

      // const today = moment().format(formatDate);

      // console.log(from, to, body, "->", today);
    } else {
      // console.log("no es mensaje");
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
const saveChatExcel = async (number, message) => {
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
app.listen(PORT, () => {
  console.log("API ESTA ARRIBA!!, PUERTO ", PORT);
});
