import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class PlanesService {
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

  getPlanes() {
    return this.http.get(`${base_url}/planes`, {
      headers: {
        'x-token': this.getToken,
      },
    });
  }
}
