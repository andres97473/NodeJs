export class RecordatorioModel {
  id: number = 0;
  tipo_doc?: string;
  num_doc_usr?: string;
  apellido1?: string;
  apellido2?: string;
  nombre1?: string;
  nombre2?: string;
  celular?: string;
  fecha_proceso?: Date;
  estado?: string;
  mensaje?: string;
  user_id?: string;
}

export class Respuesta {
  status: string = '';
  send: boolean = false;
}
