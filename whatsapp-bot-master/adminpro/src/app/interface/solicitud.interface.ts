export interface Solicitud {
  usuario: string;
  nombre: string;
  descripcion: string;
  valor: number;
  tipo: number;
  estado?: string;
  vence?: number;
  disponibles?: number;
  soporte_pago?: string;
  usr_aprueba?: string;
}
