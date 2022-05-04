require("dotenv").config();
const fs = require("fs");
const ExcelJS = require("exceljs");
const qrcode = require("qrcode-terminal");
const {
  Client,
  MessageMedia,
  LocalAuth,
  Buttons,
  Location,
} = require("whatsapp-web.js");
const moment = require("moment");
const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./database/config");

const Message = require("./models/message");

// const bodyParser = require("body-parser");

// Environment variables

const PORT = 9000 || process.env.PORT;
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

// Directorio publico
app.use(express.static("public"));

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
      // botones
      else if (msgRecibido.includes("boton")) {
        let button = new Buttons(
          "Button body",
          [{ body: "bt1" }, { body: "bt2" }],
          "title",
          "footer"
        );
        sendMessage(from, "Esto es un boton!!");
        sendMessage(from, button);
        // saveChatMongo(from, body);
      }
      // location
      else if (msgRecibido.includes("ubicacion")) {
        msg.reply(
          new Location(37.422, -122.084, "Googleplex\nGoogle Headquarters")
        );
      }

      // capturar ubicacion
      else if (msg.location) {
        // msg.reply(msg.location);

        const { latitude, longitude, description } = msg.location;

        if (latitude && description === "") {
          sendMessage(from, "Enviar su nombre");
          // const nDescription = await msg.body;

          // console.log(nBody);
          client.on("message", async (msg) => {
            // console.log(nBody);
            const nBody = await msg.body;
            const respuestaLocation = `numero: ${from}\nlatitude: ${latitude}\nlongitude: ${longitude}\ndescription: ${nBody}`;
            console.log(respuestaLocation);
            sendMessage(from, respuestaLocation);
          });
        } else {
          const respuestaLocation = `numero: ${from}\nlatitude: ${latitude}\nlongitude: ${longitude}\ndescription: ${description}`;
          console.log(respuestaLocation);
          sendMessage(from, respuestaLocation);
        }
      }

      // saveChatExcel(from, body);

      // const today = moment().format(formatDate);

      // console.log(from, to, body, "->", today);
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

/* 
Enviar media
 */
const sendMedia = (to, file) => {
  const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`);
  client.sendMessage(to, mediaFile);
};

/* 
respuesta
 */

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

const saveChatMongo = async (number, message) => {
  const chat = new Message({ number, message });

  try {
    const messageDB = await chat.save();

    // console.log(messageDB);
  } catch (error) {
    console.log(error);
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
