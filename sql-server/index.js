const rest = new (require("rest-mssql-nodejs"))({
  user: "sa",
  password: "Infosalud_01",
  server: `SERVIDORDELL\\SQLEXPRESS_PO14`, // replace this with your IP Server
  database: "factup",
});

setTimeout(async () => {
  const resultado = await rest.executeQuery(
    "SELECT TOP 10 * FROM a_hist_medic"
  );
  console.log(resultado.data);
}, 1500);
