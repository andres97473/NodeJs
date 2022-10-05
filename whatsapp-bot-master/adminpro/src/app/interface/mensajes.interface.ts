export interface Mensaje {
  _id: string;
  cod_pais: string;
  celular: string;
  mensaje: string;
  tipo: string;
  activo: boolean;
  created_at: Date | string;
}

export interface Columna {
  titulo: string;
  name: string;
}
export interface Columna2 {
  titulo: string;
  field: string;
  width: number;
}

export interface Celular {
  numero: string;
}
