export interface GetClientesI {
  ok: boolean;
  total: number;
  clientes: ClienteI[];
}

export interface ClienteI {
  _id?: string;
  num_doc_usr: string;
  tipo_doc: string;
  apellido1: string;
  apellido2: string;
  nombre1: string;
  nombre2: string;
  celular: string;
  estado: string;
  mensaje?: string;
  latitud?: string;
  longitud?: string;
  user_id?: string;
  created_at?: Date | string;
  update_at?: Date | string;
}
