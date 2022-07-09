import { Injectable, Inject } from '@angular/core';
import { LoginForm } from '../interface/login-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  url = 'http://localhost:3000/';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient
  ) {
    const url2 = this.document.location.href.split('#')[0];
    // console.log(url2);
    // activar localhost dinamico
    // this.url = url2;
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

  guardarLocalStorage(token: string) {
    localStorage.setItem('token', token);
  }

  validarToken(): Observable<boolean> {
    return this.http
      .get(`${this.url}usuarios/login/renew`, {
        headers: {
          'x-token': this.getToken,
        },
      })
      .pipe(
        map((resp: any) => {
          // this.usuario.imprimirUsuario();

          this.guardarLocalStorage(resp.token);
          return true;
        }),

        catchError((err) => of(false))
      );
  }

  logout() {
    localStorage.removeItem('token');
  }

  login(formData: LoginForm) {
    // console.log('creando usuario');
    return this.http.post(`${this.url}usuarios/login`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token);
      })
    );
  }
}
