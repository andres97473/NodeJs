import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { tap, map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { RegisterForm } from '../interface/register-form.interface';

import { LoginForm } from '../interface/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interface/cargar-usuarios.interface';

declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario!: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
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

  googleInit() {
    google.accounts.id.initialize({
      client_id:
        '857780671996-i6doqclt4a9itsnsc67mv0assvpmki02.apps.googleusercontent.com',
    });
  }

  logout() {
    localStorage.removeItem('token');

    // cambiar correo por this.usuario.email
    if (this.usuario.google) {
      google.accounts.id.revoke(this.usuario.email, () => {
        this.ngZone.run(() => {
          this.router.navigateByUrl('/login');
        });
      });
    }
    this.router.navigateByUrl('/login');
  }

  validarToken(): Observable<boolean> {
    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.getToken,
        },
      })
      .pipe(
        map((resp: any) => {
          const { email, google, nombre, role, img = '', uid } = resp.usuario;
          this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
          localStorage.setItem('token', resp.token);
          return true;
        }),
        catchError((err) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        // console.log(resp)
        localStorage.setItem('token', resp.token);
      })
    );
  }

  actualizarPerfil(data: { email: string; nombre: string; role: string }) {
    data = {
      ...data,
      role: this.usuario.role || '',
    };

    return this.http.put(`${base_url}/usuarios/${this.getUid}`, data, {
      headers: {
        'x-token': this.getToken,
      },
    });
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  cargarUsuarios(desde: number = 0) {
    // si queremos cargar la imagen debemos trasformar la data a instancias de usuario
    // para esto usamos el pipe y el metodo map

    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.getHeaders).pipe(
      map((resp) => {
        // console.log(resp);
        // debemos cambiar el arreglo de objetos a un arreglo de usuarios
        const usuarios = resp.usuarios.map(
          (user) =>
            new Usuario(
              user.nombre,
              user.email,
              '',
              user.img,
              user.google,
              user.role,
              user.uid
            )
        );

        return {
          total: resp.total,
          usuarios,
        };
      })
    );
  }
}
