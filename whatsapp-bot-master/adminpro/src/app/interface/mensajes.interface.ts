export interface Mensaje {
  _id: string;
  celular: string;
  mensaje: string;
  tipo: string;
  activo: boolean;
  created_at: Date;
}

export interface Columna {
  titulo: string;
  name: string;
}

export interface Celular {
  numero: string;
}
