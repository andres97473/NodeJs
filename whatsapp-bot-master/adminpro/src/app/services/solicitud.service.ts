import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';
import { Solicitud } from '../models/solicitud.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  public usuario!: Usuario;

  constructor(private http: HttpClient) {}

  get getToken(): string {
    return localStorage.getItem('token') || '';
  }

  get getUid(): string {
    return this.usuario.uid || '';
  }

  get getHeaders() {
    return {
      headers: {
        'x-token': this.getToken,
      },
    };
  }

  getSolicitudes() {
    return this.http.get(`${base_url}/solicitudes`, this.getHeaders);
  }

  getSolicitudID(id: string) {
    return this.http.get(`${base_url}/solicitudes/${id}`, this.getHeaders);
  }

  crearSolicitud(data: Solicitud) {
    return this.http.post(`${base_url}/solicitudes`, data, this.getHeaders);
  }

  enviarSoportePago(data: Solicitud) {
    return this.http.put(
      `${base_url}/solicitudes/enviado/${data._id}`,
      { estado: 'ENVIADO' },
      this.getHeaders
    );
  }

  cancelarSolicitud(data: Solicitud) {
    return this.http.delete(
      `${base_url}/solicitudes/enviado/${data._id}`,
      this.getHeaders
    );
  }

  cambiarEstadoSolicitud(data: Solicitud, estado: string) {
    return this.http.put(
      `${base_url}/solicitudes/estado/${data._id}`,
      { estado },
      this.getHeaders
    );
  }
}
