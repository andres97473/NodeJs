require("dotenv").config();

const cron = require("node-cron");
const exec = require("child_process").exec;
const fs = require("fs");

const host = process.env.HOST;
const hosts = [host];
const replyFromLocale = "Respuesta desde";

const promises = [];

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
