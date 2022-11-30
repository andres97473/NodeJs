require("dotenv").config();

const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia, List } = require("whatsapp-web.js");
const moment = require("moment");

const cron = require("node-cron");
const exec = require("child_process").exec;
const fs = require("fs");

// constantes
const host = process.env.HOST;
const codeNumber = process.env.NUMBER_CODE;
const phoneNumber = process.env.NUMBER_PHONE;
const hosts = [host];
const replyFromLocale = "Respuesta desde";
const promises = [];

const msg = "Chat iniciado!";
const formatDate = "DD/MM/YYYY hh:mm a";
const fech = moment().format(formatDate);
const inicioFech = msg + " " + fech;

// cleinte whatsapp
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

function pingHost() {
  hosts.forEach((host) => {
    promises.push(
      new Promise((resolve, reject) => {
        exec(`ping -n 1 -w 1000 ${host}`, (err, stdout, stderr) => {
          // successfull response: Reply from 142.250.186.78: bytes=32 time=10ms TTL=128
          // unsuccessfull:        Reply from 192.168.1.3: Destination host unreachable
          // host unreachable:     Ping request could not find host
          let status = "DESCONECTADO";
          let output = stdout.toString();
          let replyFromIndex = output.indexOf(replyFromLocale);
          if (
            replyFromIndex > 0 &&
            output.substring(replyFromIndex).toUpperCase().indexOf("BYTES") > 0
          ) {
            status = "CONECTADO";
          } else {
            console.log("Desconectado!!");
            // TODO: whatsapp
            let chatId = `${process.env.NUMBER_CODE}${process.env.NUMBER_PHONE}@c.us`;
            client.sendMessage(chatId, "Desconectado!!");
          }
          const fecha = new Date();
          resolve(
            fecha.toLocaleDateString() +
              " " +
              fecha.getHours() +
              ":" +
              fecha.getMinutes() +
              " " +
              host +
              " " +
              status
          );
        });
      })
    );
  });

  Promise.all(promises).then((results) => {
    fs.writeFile("ping-results.txt", results.join("\n"), (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
}

// ejecutar log cada segundo-> * * * * * *
// ejecutar log cada 5 segundo-> */5 * * * * *
// ejecutar log al segundo 5  de cada minuto-> 5 * * * * *

cron.schedule("*/5 * * * * *", () => {
  pingHost();
});
