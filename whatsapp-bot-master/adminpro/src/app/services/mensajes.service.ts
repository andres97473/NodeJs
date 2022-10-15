import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';

let base_url = 'http://localhost:3000/api';
const produccion = environment.produccion;

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
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

  getMensajes() {
    return this.http.get(`${base_url}/mensajes`, {
      headers: {
        'x-token': this.getToken,
      },
    });
  }

  sendMessagePrueba(formData: any) {
    return this.http.post(`${base_url}/send-message-prueba`, formData);
  }

  sendMessageToken(formData: any) {
    return this.http.post(`${base_url}/send-message-token`, formData);
  }

  sendMessageImg(formData: any) {
    return this.http.post(`${base_url}/send-message-img`, formData);
  }

  sendMessageAdmin(mensaje: string) {
    return this.http.post(
      `${base_url}/send-message-admin`,
      { mensaje },
      this.getHeaders
    );
  }
}
