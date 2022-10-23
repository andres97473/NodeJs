import { Notificacion } from '../models/notificacion.model';

export interface CargarNotificacion {
  novistos: number;
  notificaciones: Notificacion[];
}
