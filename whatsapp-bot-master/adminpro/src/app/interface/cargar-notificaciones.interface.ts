import { Notificacion } from '../models/notificacion.model';

export interface CargarNotificacion {
  novistos: number;
  total: number;
  notificaciones: Notificacion[];
}
