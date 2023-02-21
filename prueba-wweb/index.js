const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia, List } = require("whatsapp-web.js");
const { getEmployees } = require("./controllers/employees.controller.js");
const {
  getTurnosCitas,
  getCitas,
} = require("./controllers/citas.controller.js");

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
      let msgRecibido = removeAccents(body);

      if (msgRecibido.includes("ping")) {
        // sendMessage(from, "pong!!");
        // msg.reply("pong!!");
        client.sendMessage(from, "Pong!!");
      } else if (msgRecibido.includes("#empleados")) {
        getEmployees()
          .then((employees) => {
            var mensaje = "";
            empleados = [];
            empleados = employees[0];
            // console.log(empleados);
            for (const i of empleados) {
              // TODO: concatenar string
              mensaje =
                mensaje +
                "Su nombre es " +
                i.name +
                ", y su salario es: " +
                i.salary +
                "\n";
            }
            // console.log(mensaje);
            // enviar mensaje
            client.sendMessage(from, mensaje);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      //console.log("no es mensaje");
    }
  });
};
