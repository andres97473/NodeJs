const cron = require("node-cron");

// ejecutar log cada segundo-> * * * * * *
// ejecutar log cada 5 segundo-> */5 * * * * *
// ejecutar log al segundo 5  de cada minuto-> 5 * * * * *

cron.schedule("*/5 * * * * *", () => {
  console.log("Hello world!");
});
