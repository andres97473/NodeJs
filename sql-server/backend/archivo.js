const express = require("express");

// const ruta = "D:/Infosalud_sql/base_info/Img_Info/2018/08/9221-1088219367.pdf";
const archivoAlmacenado = "9221-1088219367.pdf";
const ruta = "D:/Infosalud_sql/base_info/Img_Info/2018/08/" + archivoAlmacenado;

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${archivoAlmacenado}`
  );
  return res.sendFile(ruta);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
