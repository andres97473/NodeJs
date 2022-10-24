import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';

let base_url = 'http://localhost:3000/api';
const produccion = environment.produccion;

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
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

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient
  ) {
    this.getUrl();
  }

  getUrl() {
    if (produccion) {
      base_url = this.document.location.href.split('3000')[0] + '3000/api';
    }
  }

  actualizarFoto(archivo: File, tipo: 'usuarios' | 'solicitudes', id: string) {
    const url = `${base_url}/upload/${tipo}/${id}`;

    // crear el form data con la imagen, se pueden enviar mas propiedasdes
    const formData = new FormData();
    formData.append('imagen', archivo);

    return this.http.put(url, formData, {
      headers: { 'x-token': this.getToken },
      reportProgress: true,
      observe: 'events',
    });
  }
}
