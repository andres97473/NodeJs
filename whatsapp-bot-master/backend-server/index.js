require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const moment = require("moment");
const multer = require("multer");
const fs = require("fs");

const { request, response } = require("express");
const bodyParser = require("body-parser");
const upload = multer({ dest: "uploads/" });

const { dbConnection } = require("./database/config");
const { check } = require("express-validator");
const {
  validarToken,
  validarTokenPrueba,
  validarTokenImg,
} = require("./middlewares/validar-token");
const { validarCampos } = require("./middlewares/validar-campos");

// modelos
const Usuario = require("./models/usuario");
const Mensaje = require("./models/mensaje");
const { validarJWT } = require("./middlewares/validar-jwt");

// constantes
const msg = "Chat iniciado!";
const formatDate = "DD/MM/YYYY hh:mm a";
const fech = moment().format(formatDate);
const inicioFech = msg + " " + fech;
const maxMegas = process.env.MAX_MEGAS;

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

// almacenar mensajes en mongo
const saveChatMongo = async (cod_pais, celular, mensaje, tipo, uid) => {
  try {
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      console.log("usuario no encontrado");
    } else {
      const message = new Mensaje({
        cod_pais,
        celular,
        mensaje,
        tipo,
        usuario: uid,
      });
      const mensajeDB = await message.save();
    }
  } catch (error) {
    console.log(error);
  }
};

/*
Enviar media con API
 */
const sendMediaApi = (
  codpais,
  to,
  message,
  file,
  mimetype,
  filename,
  token
) => {
  let mediaFile = MessageMedia.fromFilePath(`${file}`);
  let codPais = codpais;
  mediaFile.mimetype = mimetype;
  mediaFile.filename = filename;
  // console.log(mediaFile);
  for (const celular of to) {
    const newNumber = `${codPais.replace("+", "")}${celular}@c.us`;
    client.sendMessage(newNumber, message);
    client.sendMessage(newNumber, mediaFile);
    saveChatMongo(codPais, celular, message, "ARCHIVO", token);
  }
};

// controladores mensajes

const sendMessagesPrueba = async (req, res = response) => {
  const numPrueba = req.numprueba;
  let codpais = req.codpais;

  const { repeticiones, mensaje, token } = req.body;

  try {
    for (let index = 0; index < Number(repeticiones); index++) {
      const newNumber = `${codpais.replace("+", "")}${numPrueba}@c.us`;
      client.sendMessage(newNumber, mensaje);
      saveChatMongo(codpais, numPrueba, mensaje, "PRUEBA", token);
    }

    res.json({
      ok: true,
      msg: `Numero de Mensajes enviados: ${repeticiones}`,
      enviados: repeticiones,
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
  let { mensaje, token, cod_pais } = req.body;
  const disponibles = req.disponibles;
  const token_vence = req.vence;
  const celulares = req.celulares;
  let codpais = cod_pais || req.codpais;

  // convertir a array de numeros

  try {
    for (const celular of celulares) {
      const newNumber = `${codpais.replace("+", "")}${celular}@c.us`;
      client.sendMessage(newNumber, mensaje);
      saveChatMongo(codpais, celular, mensaje, "MENSAJE", token);
    }

    res.json({
      ok: true,
      msg: `Mensajes enviados con exito!!`,
      enviados: celulares.length,
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

const borrarImagen = (path) => {
  if (fs.existsSync(path)) {
    // borrar la imagen anterior
    fs.unlinkSync(path);
  }
};

// enviar mensaje con img y token
const sendMessageImg = async (req = request, res = response) => {
  const disponibles = req.disponibles;
  const token_vence = req.vence;
  const celulares = req.celulares;
  let { mensaje, token, cod_pais } = req.body;
  let codpais = cod_pais || req.codpais;

  // definir imagen, tipo y nombre original
  const imagen = req.file;
  const mimetype = imagen.mimetype;
  const filename = imagen.originalname;

  // Validar que exista un archivo enviado por el req
  if (!req.file || Object.keys(req.file).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No hay ningun archivo",
    });
  } else if (req.file.size / 1024 / 1024 > maxMegas) {
    const pathViejo = `./uploads/${imagen.filename}`;
    borrarImagen(pathViejo);
    return res.status(400).json({
      ok: false,
      msg: `El archivo supera los ${maxMegas} Megabytes`,
    });
  }

  try {
    // enviar imagen a celulares
    sendMediaApi(
      codpais,
      celulares,
      mensaje,
      imagen.path,
      mimetype,
      filename,
      token
    );

    res.status(200).json({
      ok: true,
      msg: "Mensajes enviado con exito!!",
      enviados: celulares.length,
      disponibles,
      token_vence,
    });

    const pathViejo = `./uploads/${imagen.filename}`;
    borrarImagen(pathViejo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs ",
    });
  }
};

const sendMessagesAdmin = async (req, res = response) => {
  const { mensaje } = req.body;

  try {
    const admins = await Usuario.find(
      {
        role: "ADMIN_ROLE",
      },
      { celular: 1, _id: 0 }
    );

    for (const admin of admins) {
      const newNumber = `${process.env.NUMBER_CODE}${admin.celular}@c.us`;
      client.sendMessage(newNumber, mensaje);
    }

    res.status(200).json({
      ok: true,
      msg: mensaje,
      admins,
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
app.use("/api/login", require("./routes/auth"));
app.use("/api/todo", require("./routes/busquedas"));
app.use("/api/upload", require("./routes/uploads"));
app.use("/api/mensajes", require("./routes/mensajes"));
app.use("/api/planes", require("./routes/planes"));
app.use("/api/solicitudes", require("./routes/solicitudes"));
app.use("/api/paises", require("./routes/paises"));

// Rutas Mensajes
app.post(
  "/api/send-message-prueba",
  [
    check("token", "El token debe ser valido").isMongoId(),
    check("mensaje", "El mensaje es obligatorio").not().isEmpty(),
    check("repeticiones", "El mensaje es obligatorio").not().isEmpty(),
    validarCampos,
    validarTokenPrueba,
  ],
  sendMessagesPrueba
);

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
  "/api/send-message-img",
  [upload.single("imagen"), validarTokenImg],
  sendMessageImg
);

app.post(
  "/api/send-message-admin",
  [
    validarJWT,
    check("mensaje", "El mensaje es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  sendMessagesAdmin
);

// Validar error de diferentes rutas
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en el puerto ", process.env.PORT);
});
