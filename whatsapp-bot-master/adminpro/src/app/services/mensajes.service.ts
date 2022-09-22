import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
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
}
