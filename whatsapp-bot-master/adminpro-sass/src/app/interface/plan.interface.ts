export interface Plan {
  _id: string;
  nombre: string;
  descripcion: string;
  valor: number;
  tipo: number;
  disponibles?: number;
  vence?: number;
  popular: boolean;
  orden: number;
  activo: boolean;
  created_at: Date;
}
