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
const Cliente = require("./models/cliente");
const { response } = require("express");

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
      } else if (msgRecibido.includes("confirmar")) {
        const msg = String(msgRecibido);
        const arrayMsg = msg.split(",", 2);
        const docCliente = arrayMsg[0];
        console.log(docCliente);

        sendMessage(from, "Usuario confirmado");
        const clienteDB = await Cliente.findOne({ num_doc_usr: docCliente });
        console.log(clienteDB);
      }
      // location
      else if (msgRecibido.includes("ubicacion")) {
        msg.reply(
          new Location(37.422, -122.084, "Googleplex\nGoogle Headquarters")
        );
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

const sendButton = (to) => {
  let button = new Buttons(
    "Button body",
    [{ body: "bt1" }, { body: "bt2" }, { body: "bt3" }],
    "title",
    "footer"
  );
  client.sendMessage(to, button);
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

// guardar chat en mongo
const saveChatMongo = async (number, message) => {
  const chat = new Message({ number, message });

  try {
    const messageDB = await chat.save();

    // console.log(messageDB);
  } catch (error) {
    console.log(error);
  }
};
// guardar chat en mongo
const saveRecordatorioMongo = async (
  num_doc_usr,
  tipo_doc,
  apellido1,
  apellido2,
  nombre1,
  nombre2,
  celular
) => {
  const recordatorio = new Cliente({
    num_doc_usr,
    tipo_doc,
    apellido1,
    apellido2,
    nombre1,
    nombre2,
    celular,
  });

  try {
    const messageDB = await recordatorio.save();

    // console.log(messageDB);
  } catch (error) {
    console.log(error);
  }
};

// buscar Cliente
const findCliente = async (num_doc_usr) => {
  try {
    const clienteDB = await Cliente.find({ num_doc_usr });

    if (!clienteDB) {
      return "No existe ese cliente";
    }
    return clienteDB;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
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

// enviar recordatorio con api
const sendRecordatorio = (req, res) => {
  const {
    num_doc_usr,
    tipo_doc,
    apellido1,
    apellido2,
    nombre1,
    nombre2,
    celular,
  } = req.body;
  const newNumber = `${number_code}${celular}@c.us`;
  const message = `Estimado sr(a) ${nombre1} ${nombre2} ${apellido1} ${apellido2}, su numero de documento es: ${num_doc_usr}?, si su informacion es correcta por favor dar click en el siguiente enlace`;

  // console.log(message, celular);
  // enviar mensaje y boton
  sendMessage(newNumber, message);
  sendMessage(
    newNumber,
    `https://wa.me/57${number}?text=${num_doc_usr},confirmar`
  );

  // respuesta de api
  res.send({ status: "Mensajes Enviados v2..", send: true });

  // almacenar Clientes enviados en mongo
  saveRecordatorioMongo(
    num_doc_usr,
    tipo_doc,
    apellido1,
    apellido2,
    nombre1,
    nombre2,
    celular
  );

  // enviar boton
  sendButton(newNumber);
};

// RUTAS
app.post("/send", sendWithApi);
app.post("/recordatorio", sendRecordatorio);

// LEVANTAR API
app.listen(PORT, () => {
  console.log("API ESTA ARRIBA!!, PUERTO ", PORT);
});
