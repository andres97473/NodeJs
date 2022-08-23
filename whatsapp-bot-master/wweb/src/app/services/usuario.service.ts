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
  disponibles = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient
  ) {
    const url2 = this.document.location.href.split('#')[0];
    console.log(url2);
    // activar localhost dinamico
    //this.url = url2;
  }

  get getToken(): string {
    return localStorage.getItem('token') || '';
  }
  get getusuario(): string {
    return localStorage.getItem('usuario') || '';
  }

  get getHeaders() {
    return {
      headers: {
        'x-token': this.getToken,
      },
    };
  }

  getUsuarioLocal() {
    const usuario = localStorage.getItem('usuario');

    return usuario ? JSON.parse(usuario) : null;
  }

  guardarLocalStorage(token: string, usuario: any) {
    const usuarioString = JSON.stringify(usuario);

    if (usuarioString) {
      let usuarioObj = JSON.parse(usuarioString);
      const { password, ...nUsuario } = usuarioObj;
      localStorage.setItem('usuario', JSON.stringify(nUsuario));
    }

    localStorage.setItem('token', token);
  }

  validarToken(): Observable<boolean> {
    return this.http
      .get(`${this.url}api/login/renew`, {
        headers: {
          'x-token': this.getToken,
        },
      })
      .pipe(
        map((resp: any) => {
          // console.log(resp);

          // this.usuario.imprimirUsuario();

          this.guardarLocalStorage(resp.token, resp.usuario);
          return true;
        }),

        catchError((err) => of(false))
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  login(formData: LoginForm) {
    // console.log('creando usuario');
    return this.http.post(`${this.url}api/login`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.usuario);
      })
    );
  }
}
