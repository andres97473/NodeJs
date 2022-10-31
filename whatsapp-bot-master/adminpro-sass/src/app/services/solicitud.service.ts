import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';
import { Solicitud } from '../models/solicitud.model';
import { DOCUMENT } from '@angular/common';

let base_url = 'http://localhost:3000/api';
const produccion = environment.produccion;

@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  public usuario!: Usuario;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.getUrl();
  }

  getUrl() {
    if (produccion) {
      base_url = this.document.location.href.split('3000')[0] + '3000/api';
    }
  }

  // leer cokkie
  readCookie(name: string) {
    return (
      decodeURIComponent(
        document.cookie.replace(
          new RegExp(
            '(?:(?:^|.*;)\\s*' +
              name.replace(/[\-\.\+\*]/g, '\\$&') +
              '\\s*\\=\\s*([^;]*).*$)|^.*$'
          ),
          '$1'
        )
      ) || null
    );
  }

  // seters
  setToken(token: string): void {
    //localStorage.setItem('token', token);
    document.cookie = `token=${token}`;
  }

  // geters

  get getToken(): string {
    //return localStorage.getItem('token');
    const token = this.readCookie('token');
    if (token) {
      return token;
    } else {
      return '';
    }
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
