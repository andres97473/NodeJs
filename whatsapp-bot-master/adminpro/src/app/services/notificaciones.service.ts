import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';
import { Notificacion } from '../models/notificacion.model';

let base_url = 'http://localhost:3000/api';
const produccion = environment.produccion;

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
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

  get getToken(): string {
    return localStorage.getItem('token') || '';
  }

  get getHeaders() {
    return {
      headers: {
        'x-token': this.getToken,
      },
    };
  }

  getNotificaciones() {
    return this.http.get(`${base_url}/notificaciones`, {
      headers: {
        'x-token': this.getToken,
      },
    });
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
