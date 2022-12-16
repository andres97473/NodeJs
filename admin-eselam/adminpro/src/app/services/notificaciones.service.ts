import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';
import { Notificacion } from '../models/notificacion.model';
import { CargarNotificacion } from '../interface/cargar-notificaciones.interface';

let base_url = 'http://localhost:3000/api';
const produccion = environment.produccion;

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  public novistos = 0;
  public total = 0;
  public notificaciones: Notificacion[] = [];

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

  get getHeaders() {
    return {
      headers: {
        'x-token': this.getToken,
      },
    };
  }

  getNotificaciones(desde: number = 0) {
    return this.http.get<CargarNotificacion>(
      `${base_url}/notificaciones?desde=${desde}`,
      {
        headers: {
          'x-token': this.getToken,
        },
      }
    );
  }

  postNotificacion(notificacion: Notificacion) {
    return this.http.post(`${base_url}/notificaciones`, notificacion, {
      headers: {
        'x-token': this.getToken,
      },
    });
  }

  verNotificacion(id: string) {
    return this.http.put(
      `${base_url}/notificaciones/ver/${id}`,
      {},
      {
        headers: {
          'x-token': this.getToken,
        },
      }
    );
  }
}
