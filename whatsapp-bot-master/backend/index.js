require("dotenv").config();
var c = require("child_process");
const fs = require("fs");
const ExcelJS = require("exceljs");
const qrcode = require("qrcode-terminal");
const {
  Client,
  MessageMedia,
  LocalAuth,
  Buttons,
  Location,
  List,
} = require("whatsapp-web.js");
const moment = require("moment");
const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./database/config");

const Message = require("./models/message");
const Cliente = require("./models/cliente");
const Usuario = require("./models/usuario");
const { request, response } = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const jwt = require("jsonwebtoken");

const upload = multer({ dest: "uploads/" });
// const bodyParser = require("body-parser");

// Environment variables

const PORT = 3000 || process.env.PORT;
const number_code = "57";
const number = "3166651382";
const msg = "Chat iniciado!";
const formatDate = "DD/MM/YYYY hh:mm a";
const fech = moment().format(formatDate);
const inicioFech = msg + " " + fech;

// constante app para iniciar express
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

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
        // correr app desde navegador
        // Abrir con navegador predeterminado
        // TODO: abrir con navegador predeterminado
        //c.exec("start http://localhost:3000/#/");
      }
    });
  }, 500);
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
      // else if (msgRecibido.includes("boton")) {
      //   let button = new Buttons(
      //     "Button body",
      //     [
      //       { id: "1", body: "btn1" },
      //       { id: "2", body: "btn2" },
      //     ],
      //     "title",
      //     "footer"
      //   );
      //   console.log(from);
      //   console.log(button);
      //   sendMessage(from, button);
      // }
      // listas
      else if (msgRecibido.includes("lista")) {
        let sections = [
          {
            title: "sectionTitle",
            rows: [
              { title: "ListItem1", description: "desc" },
              { title: "ListItem2" },
            ],
          },
        ];
        let list = new List(
          "List body",
          "btnText",
          sections,
          "Title",
          "footer"
        );
        client.sendMessage(from, list);
        console.log(list);
      }
      // confirmar usuario
      else if (msgRecibido.includes("confirmar")) {
        const msg = String(msgRecibido);
        const arrayMsg = msg.split(",", 2);
        const docCliente = arrayMsg[0];
        //console.log(docCliente);

        sendMessage(from, "Usuario confirmado");
        const clienteDB = await Cliente.findOne({ num_doc_usr: docCliente });
        // console.log(clienteDB);
        const updateEstado = await Cliente.updateOne(
          { num_doc_usr: docCliente },
          { $set: { estado: "CONFIRMADO", update_at: new Date() } }
        );
      }
      // cancelar usuario
      else if (msgRecibido.includes("cancelar")) {
        const msg = String(msgRecibido);
        const arrayMsg = msg.split(",", 2);
        const docCliente = arrayMsg[0];
        //console.log(docCliente);

        sendMessage(from, "Usuario cancelado");
        const clienteDB = await Cliente.findOne({ num_doc_usr: docCliente });
        // console.log(clienteDB);
        const updateEstado = await Cliente.updateOne(
          { num_doc_usr: docCliente },
          { $set: { estado: "CANCELADO", update_at: new Date() } }
        );
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
        const newNUmero = from.slice(2);
        const newNumero2 = newNUmero.replace("@c.us", "");

        const respuestaLocation = `numero: ${newNumero2}\nlatitude: ${latitude}\nlongitude: ${longitude}\ndescription: ${description}`;
        // console.log(respuestaLocation);
        sendMessage(from, "Su ubicacion se almaceno con exito");

        const updateUbicacion = await Cliente.updateMany(
          { celular: newNumero2 },
          {
            $set: {
              longitud: longitude,
              latitud: latitude,
              update_at: new Date(),
            },
          }
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
Funcion para enviar mensajes, recibe array de numeros
 */
const sendMessageNumeros = (to, message) => {
  for (const celular of to) {
    const newNumber = `${number_code}${celular}@c.us`;
    client.sendMessage(newNumber, message);
  }
};

/*
Enviar media
 */
const sendMedia = (to, file) => {
  const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`);
  client.sendMessage(to, mediaFile);
};

/*
Enviar media con API
 */
const sendMediaApi = (to, message, file, mimetype, filename) => {
  let mediaFile = MessageMedia.fromFilePath(`${file}`);
  mediaFile.mimetype = mimetype;
  mediaFile.filename = filename;
  // console.log(mediaFile);
  for (const celular of to) {
    const newNumber = `${number_code}${celular}@c.us`;
    client.sendMessage(newNumber, message);
    client.sendMessage(newNumber, mediaFile);
  }
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
        return err;
      });
  }
};

// guardar chat en mongo
const saveChatMongo = async (number, message, user_id) => {
  const chat = new Message({ number, message, user_id });

  try {
    const messageDB = await chat.save();

    // console.log(messageDB);
  } catch (error) {
    console.log(error);
    return error;
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
  celular,
  mensaje,
  user_id
) => {
  const recordatorio = new Cliente({
    num_doc_usr,
    tipo_doc,
    apellido1,
    apellido2,
    nombre1,
    nombre2,
    celular,
    mensaje,
    user_id,
  });

  try {
    const clienteDB = await Cliente.findOne({ num_doc_usr, user_id });
    if (clienteDB) {
      return "Usuario ya existe";
    }
    const messageDB = await recordatorio.save();

    // console.log(messageDB);
  } catch (error) {
    console.log(error);
    return error;
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
    return res.status(500).json({
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
  //console.log(message, to);

  sendMessage(newNumber, message);
  res.send({ status: "Mensajes Enviados !!", send: true });
};

// enviar recordatorio con api
const sendRecordatorioFijo = (req, res) => {
  const {
    num_doc_usr,
    tipo_doc,
    apellido1,
    apellido2,
    nombre1,
    nombre2,
    celular,
    mensaje,
  } = req.body;
  const newNumber = `${number_code}${celular}@c.us`;
  const message = mensaje;

  sendMessage(newNumber, mensaje);

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
    celular,
    message
  );
};

// enviar recordatorio con api token
const sendRecordatorioFijoToken = async (req, res) => {
  const { celulares, mensaje, token } = req.body;

  try {
    const usuario = await Usuario.findOne({ _id: token });

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no existe",
      });
    }
    if (celulares.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No hay numeros para enviar mensaje",
      });
    }
    if (mensaje.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No hay mensaje para enviar",
      });
    }

    // validar fecha de vencimiento
    const token_vence = usuario.vence;

    const fechaVencimiento = moment(token_vence);
    const fechaActual = moment();

    const diferencia = fechaVencimiento.diff(fechaActual, "days");

    if (diferencia < 0) {
      if (usuario.disponibles < celulares.length) {
        return res.status(404).json({
          ok: false,
          msg: "No hay suficientes mensajes disponibles y el token ha expirado",
          disponibles: usuario.disponibles,
          token_vence,
        });
      } else {
        // enviar mensajes
        sendMessageNumeros(celulares, mensaje);

        for (const celular of celulares) {
          saveChatMongo(celular, mensaje, token);
        }

        const nuevoDisponible = usuario.disponibles - celulares.length;
        const resultadoDisponible = nuevoDisponible < 0 ? 0 : nuevoDisponible;

        const updateDisponibles = await Usuario.updateOne(
          { email: usuario.email },
          { $set: { disponibles: resultadoDisponible, update_at: new Date() } }
        );

        return res.status(200).json({
          ok: true,
          msg: "Mensaje enviado con exito!!",
          disponibles: resultadoDisponible,
          token_vence,
        });
      }
    }

    // enviar mensajes
    sendMessageNumeros(celulares, mensaje);

    res.status(200).json({
      ok: true,
      msg: "Mensaje enviado con exito!!",
      disponibles: usuario.disponibles,
      token_vence,
    });

    for (const celular of celulares) {
      saveChatMongo(celular, mensaje, token);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs ",
    });
  }
};
// enviar mensaje con inm y token
const sendMessageImg = async (req = request, res = response) => {
  let { celulares, mensaje, token } = req.body;
  // Validar que exista un archivo enviado por el req
  if (!req.file || Object.keys(req.file).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No hay ningun archivo",
    });
  }

  // definir imagen, tipo y nombre original
  const imagen = req.file;
  const mimetype = imagen.mimetype;
  const filename = imagen.originalname;

  // convertir a array de numeros
  celulares = celulares.split(",");

  try {
    const usuario = await Usuario.findOne({ _id: token });

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no existe",
      });
    }
    if (celulares.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No hay numeros para enviar mensaje",
      });
    }

    // validar fecha de vencimiento
    const token_vence = usuario.vence;

    const fechaVencimiento = moment(token_vence);
    const fechaActual = moment();

    const diferencia = fechaVencimiento.diff(fechaActual, "days");

    if (diferencia < 0) {
      if (usuario.disponibles < celulares.length) {
        return res.status(404).json({
          ok: false,
          msg: "No hay suficientes mensajes disponibles y el token ha expirado",
          disponibles: usuario.disponibles,
          token_vence,
        });
      } else {
        // enviar imagen a celulares
        sendMediaApi(celulares, mensaje, imagen.path, mimetype, filename);

        for (const celular of celulares) {
          saveChatMongo(celular, mensaje, token);
        }

        const nuevoDisponible = usuario.disponibles - celulares.length;
        const resultadoDisponible = nuevoDisponible < 0 ? 0 : nuevoDisponible;

        const updateDisponibles = await Usuario.updateOne(
          { email: usuario.email },
          { $set: { disponibles: resultadoDisponible, update_at: new Date() } }
        );

        return res.status(200).json({
          ok: true,
          msg: "Mensaje enviado con exito!!",
          disponibles: resultadoDisponible,
          token_vence,
        });
      }
    }

    // enviar imagen a celulares
    sendMediaApi(celulares, mensaje, imagen.path, mimetype, filename);

    res.status(200).json({
      ok: true,
      msg: "Mensaje enviado con exito!!",
      disponibles: usuario.disponibles,
      token_vence,
    });

    for (const celular of celulares) {
      saveChatMongo(celular, mensaje, token);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs ",
    });
  }
};

// enviar recordatorio desde app
const sendRecordatorioApp = async (req, res) => {
  const { token } = req.params;
  const {
    num_doc_usr,
    tipo_doc,
    apellido1,
    apellido2,
    nombre1,
    nombre2,
    celular,
  } = req.body;
  const celulares = [];
  try {
    // TODO: validaciones
    const usuario = await Usuario.findOne({ _id: token });

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no existe",
      });
    }
    if (celular.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No hay numeros para enviar mensaje",
      });
    }

    // enviar mensaje a celulares
    const newNumber = `${number_code}${celular}@c.us`;
    const message = `${nombre1} ${nombre2} ${apellido1} ${apellido2}, su numero de documento es: ${num_doc_usr}?, si su informacion es correcta por favor seleccione una de las siguientes opciones`;

    // Crear lista
    let sections = [
      {
        title: "Seleccione una Respuesta y presione Enviar",
        rows: [
          { title: `${num_doc_usr},confirmar` },
          { title: `${num_doc_usr},cancelar` },
        ],
      },
    ];
    let list = new List(
      message,
      "Opciones",
      sections,
      "Estimado sr(a)",
      "gracias por su tiempo"
    );

    celulares.push(celular);

    // validar fecha de vencimiento
    const token_vence = usuario.vence;

    const fechaVencimiento = moment(token_vence);
    const fechaActual = moment();

    const diferencia = fechaVencimiento.diff(fechaActual, "days");

    if (diferencia < 0) {
      if (usuario.disponibles < celulares.length) {
        return res.status(404).json({
          ok: false,
          msg: "No hay suficientes mensajes disponibles y el token ha expirado",
          disponibles: usuario.disponibles,
          token_vence,
        });
      } else {
        // enviar mensaje a celular
        sendMessage(newNumber, list);

        const nuevoDisponible = usuario.disponibles - celulares.length;
        const resultadoDisponible = nuevoDisponible < 0 ? 0 : nuevoDisponible;

        const updateDisponibles = await Usuario.updateOne(
          { email: usuario.email },
          { $set: { disponibles: resultadoDisponible, update_at: new Date() } }
        );

        // cambiar Estado del Cliente
        const updateEstado = await Cliente.updateOne(
          { num_doc_usr },
          { $set: { estado: "ENVIADO", update_at: new Date() } }
        );
        res.send({ status: "Mensaje Enviado v2..", send: true });
      }
    }
    // enviar mensaje a celular
    sendMessage(newNumber, list);

    // cambiar Estado del Cliente
    const updateEstado = await Cliente.updateOne(
      { num_doc_usr },
      { $set: { estado: "ENVIADO", update_at: new Date() } }
    );
    res.send({ status: "Mensaje Enviado v2..", send: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs ",
    });
  }
};
// enviar recordatorio desde app mensaje fijo
const sendRecordatorio = (req, res) => {
  const {
    num_doc_usr,
    tipo_doc,
    apellido1,
    apellido2,
    nombre1,
    nombre2,
    celular,
    user_id,
  } = req.body;
  const newNumber = `${number_code}${celular}@c.us`;
  const message = `${nombre1} ${nombre2} ${apellido1} ${apellido2}, su numero de documento es: ${num_doc_usr}?, si su informacion es correcta por favor seleccione una de las siguientes opciones`;

  const txt1 = "Estimado sr(a)";
  // Crear lista
  let sections = [
    {
      title: "Seleccione una Respuesta y presione Enviar",
      rows: [
        { title: `${num_doc_usr},confirmar` },
        { title: `${num_doc_usr},cancelar` },
      ],
    },
  ];
  let list = new List(message, "Opciones", sections, txt1);

  sendMessage(newNumber, list);

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
    celular,
    txt1 + " " + message,
    user_id
  );
};

// Rutas de mensajes
// app.post("/send", sendWithApi);
// app.post("/recordatorio", sendRecordatorio);
app.post("/recordatorio-app/:token", sendRecordatorioApp);
// app.post("/recordatorio-fijo", sendRecordatorioFijo);

// rutas validadas
app.post("/send-message-token", sendRecordatorioFijoToken);
app.post("/send-message-img", upload.single("imagen"), sendMessageImg);
// rutas de clientes
app.use("/api/clientes", require("./routes/clientes"));
// rutas de usuarios
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/login", require("./routes/auth"));
// rutas de menus
app.use("/api/menus", require("./routes/menus"));

// LEVANTAR API
app.listen(PORT, () => {
  console.log("API ESTA ARRIBA!!, PUERTO ", PORT);
});
