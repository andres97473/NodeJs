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
    // console.log(resultado);

    res.json({ resultado: resultado.data });
  }
  async historiasPaciente(req, res) {
    let { historia } = req.params;

    historia = "'" + historia + "'";

    const resultado = await rest.executeQuery(
      // seleccionar historias por numero de historia
      `SELECT hm.contador
      ,hm.num_orden
      ,hm.num_paciente_hist
      ,hm.no_historia
      ,hm.no_factura
      ,hm.especialidad_historia
      ,hm.tipo_atencion
      ,hm.pabellon
      ,hm.cama
      ,hm.nombre_estudio
      ,md.apellido1 as 'md_apellido1'
	  ,md.apellido2 as 'md_apellido2'
	  ,md.nombre1 as 'md_nombre1'
	  ,md.nombre2 as 'md_nombre2'
	  ,md.especialidad as 'md_especialidad'
	  ,md.Codigo as 'md_codigo'
	  ,md.identificacion as 'md_identificacion'
	  ,md.reg_medico as 'md_reg_medico'
      ,hm.texto01
      ,hm.texto02
      ,hm.texto03
      ,hm.usuario
      ,convert(varchar(10),hm.fecha_dig,101) + stuff(right(convert(varchar(20),hm.fecha_dig,100),8),7,0,' ') as fecha_dig
      ,hm.anulado
      ,hm.estado_folio
      ,hm.parametros
      ,hm.ordenar
      ,hm.etiqueta
      ,hm.migra
	  ,ap.apellido1 as 'ap_apellido1'
	  ,ap.apellido2 as 'ap_apellido2'
	  ,ap.nombre1 as 'ap_nombre1'
	  ,ap.nombre2 as 'ap_nombre2'
	  ,ap.identificacion
	  ,ap.sexo
	  ,ap.telefono
	  ,Format(ap.fecha_nac,'dd/MM/yyyy') AS fecha_nac
	  ,ap.direccion
	  ,br.Nombre as 'barrio_nombre'
	  ,ap.municipio
	  ,em.Nombre as 'empresa_nombre'
	  ,adj.direccion_archivo
  FROM a_hist_medic as hm
  INNER JOIN a_paciente as ap ON( ap.no_historia = hm.no_historia)
  INNER JOIN medicos as md ON( md.Codigo = hm.medico) 
  left JOIN barrios as br ON( br.Codigo = ap.barrio)
  left JOIN empresa as em ON( em.Codigo = ap.empresa)
  left JOIN a_hist_reg_adjuntos as adj ON(adj.num_orden = hm.num_orden)  
  where hm.no_historia=${historia} 
  order by num_orden desc`
    );

    console.log(resultado);

    res.json({ historia, resultado });
  }
}

module.exports = new HistoriaController();
