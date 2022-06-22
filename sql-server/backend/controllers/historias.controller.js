const resultado = require("../myfile.json");
const codigos = require("../myfile2.json");
const rest = new (require("rest-mssql-nodejs"))({
  user: "sa",
  password: "Infosalud_01",
  server: `SERVIDORDELL\\SQLEXPRESS_PO14`, // replace this with your IP Server
  database: "factup",
});

class HistoriaController {
  async index(req, res) {
    res.json({ resultado });
  }
  async codigos(req, res) {
    res.json({ codigos });
  }
  async historias(req, res) {
    const resultado = await rest.executeQuery(
      // seleccionar un registro por cada tipo
      "SELECT l.contador ,l.num_orden,l.num_paciente_hist,l.no_historia,l.no_factura,l.especialidad_historia,l.tipo_atencion,l.pabellon,l.cama,l.nombre_estudio,l.medico,l.texto01,l.texto02,l.texto03,l.usuario,l.fecha_dig,l.anulado,l.estado_folio,l.parametros,l.ordenar,l.etiqueta,l.migra FROM [factup].[dbo].[a_hist_medic] l WHERE num_orden = (select top 1 lg.num_orden FROM [factup].[dbo].[a_hist_medic] lg where lg.nombre_estudio = l.nombre_estudio order by lg.num_orden desc)"
      // "SELECT l.texto01 FROM [factup].[dbo].[a_hist_medic] l"
    );
    console.log(resultado);

    res.json({ resultado: resultado.data });
  }
}

module.exports = new HistoriaController();
