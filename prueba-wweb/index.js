const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia, List } = require("whatsapp-web.js");
const moment = require("moment");
const { getEmployees } = require("./controllers/employees.controller.js");
const {
  getMensajeDisponibles,
  asignarCitaDisponible,
} = require("./promises/index.js");

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
      const pattern1 = /^#disponibles:./;
      const pattern2 = /^#asignar:./;

      if (msgRecibido.includes("ping")) {
        // sendMessage(from, "pong!!");
        // msg.reply("pong!!");
        client.sendMessage(from, "Pong!!");
      } else if (msgRecibido.includes("#cita")) {
        const formatDate = "YYYY-MM-DD";
        var nFecha = new Date();
        const mensaje =
          "Para buscar las citas disponibles en un dia " +
          "escriba #disponibles seguido de la fecha para la que quiere su cita, ejemplo:";
        const mensaje2 =
          "#disponibles:" +
          moment(nFecha.setDate(nFecha.getDate() + 1)).format(formatDate);
        // enviar mensaje
        setTimeout(() => {
          client.sendMessage(from, mensaje);
        }, 1000);
        setTimeout(() => {
          client.sendMessage(from, mensaje2);
        }, 1500);
      } else if (msgRecibido.match(pattern1) && msgRecibido != "") {
        const array = msgRecibido.split(":");
        const mensaje =
          "Para asignar una de las citas disponibles envia un mensaje con la siguiente extrectura:\n" +
          "#asignar:codigo del profesional:numero de docuemnto:fecha:hora:minutos:AM o PM\n" +
          "Ejemplo:*#asignar:21:1081594301:2023-03-27:12:30:PM*";

        getMensajeDisponibles(array[1])
          .then((res) => {
            // console.log(res);

            // enviar citas disponiles para un dia
            setTimeout(() => {
              client.sendMessage(from, res);
            }, 1000);

            // enviar ejemplo de como asignar una cita
            setTimeout(() => {
              client.sendMessage(from, mensaje);
            }, 1200);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (msgRecibido.match(pattern2) && msgRecibido != "") {
        const numWhatsapp = from.split("@");
        // console.log(numWhatsapp[0]);

        asignarCitaDisponible(msgRecibido, numWhatsapp[0])
          .then((res) => {
            // enviar citas disponiles para un dia
            setTimeout(() => {
              client.sendMessage(from, res);
            }, 1000);
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
