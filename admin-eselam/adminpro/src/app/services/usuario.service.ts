import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { RegisterForm } from '../interface/register-form.interface';

import { LoginForm } from '../interface/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interface/cargar-usuarios.interface';
import { DOCUMENT } from '@angular/common';

// declare const google: any;

let base_url = 'http://localhost:3000/api';
const produccion = environment.produccion;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario!: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.getUrl();
    // this.googleInit();
  }

  getUrl() {
    if (produccion) {
      base_url = this.document.location.href.split('3000')[0] + '3000/api';
    }
  }

  get getRole() {
    return this.usuario.role || 'USER_ROLE';
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

  // googleInit() {
  //   google.accounts.id.initialize({
  //     client_id:
  //       '857780671996-i6doqclt4a9itsnsc67mv0assvpmki02.apps.googleusercontent.com',
  //   });
  // }

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

  guardarLocalStorage(resp: any) {
    localStorage.setItem('menu', JSON.stringify(resp.menu));
  }

  logout() {
    localStorage.removeItem('menu');

    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC';

    // google auth
    // if (this.usuario.google) {
    //   // console.log(this.usuario.email);

    //   google.accounts.id.revoke(this.usuario.email, () => {
    //     this.ngZone.run(() => {
    //       this.router.navigateByUrl('/login');
    //     });
    //   });
    // }
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
          const {
            email,
            nombre1,
            nombre2,
            apellido1,
            apellido2,
            num_documento,
            tipo_doc,
            modulos,
            role,
            img = '',
            uid,
            celular,
            activo,
            created_at,
            update_at,
          } = resp.usuario as Usuario;
          this.usuario = new Usuario(
            num_documento,
            tipo_doc,
            email,
            apellido1,
            apellido2,
            nombre1,
            nombre2,
            celular,
            img,
            role,
            modulos,
            '',
            activo,
            created_at,
            update_at,
            uid
          );
          // guardar propiedades en el local storage
          this.guardarLocalStorage(resp);
          this.setToken(resp.token);

          return true;
        }),
        catchError((err) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        // console.log(resp);
        this.guardarLocalStorage(resp);
        this.setToken(resp.token);
      })
    );
  }

  actualizarPerfil(data: { email: string; nombre: string; role: string }) {
    data = {
      ...data,
      role: this.usuario.role || '',
    };

    return this.http.put(
      `${base_url}/usuarios/${this.getUid}`,
      data,
      this.getHeaders
    );
  }

  actualizarPassword(password: string) {
    return this.http.put(
      `${base_url}/usuarios/password/${this.getUid}`,
      { password },
      this.getHeaders
    );
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp);
        this.setToken(resp.token);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp);
        this.setToken(resp.token);
      })
    );
  }

  cargarUsuarios(desde: number = 0) {
    // si queremos cargar la imagen debemos trasformar la data a instancias de usuario
    // para esto usamos el pipe y el metodo map

    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.getHeaders).pipe(
      map((resp) => {
        // debemos cambiar el arreglo de objetos a un arreglo de usuarios
        const usuarios = resp.usuarios.map(
          (user) =>
            new Usuario(
              user.num_documento,
              user.tipo_doc,
              user.email,
              user.apellido1,
              user.apellido2,
              user.nombre1,
              user.nombre2,
              user.celular,
              user.img,
              user.role,
              user.modulos,
              '',
              user.activo,
              user.created_at,
              user.update_at,
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

  eliminarUsuario(usuario: Usuario) {
    // http://localhost:3000/api/usuarios/630c047fdc09bf074a34d344
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.getHeaders);
  }

  guardarUsuario(usuario: Usuario) {
    return this.http.put(
      `${base_url}/usuarios/${usuario.uid}`,
      usuario,
      this.getHeaders
    );
  }

  verificarEmail(recoveryEmail: any) {
    return this.http.post(
      `${base_url}/usuarios/verificar-email`,
      recoveryEmail,
      {}
    );
  }

  cambiarPasswordCelular(email: string) {
    return this.http.post(`${base_url}/send-message-password`, { email }, {});
  }
}
