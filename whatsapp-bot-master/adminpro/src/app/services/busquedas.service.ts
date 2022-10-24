import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

import { Usuario } from '../models/usuario.model';
import { DOCUMENT } from '@angular/common';

let base_url = 'http://localhost:3000/api';
const produccion = environment.produccion;

@Injectable({
  providedIn: 'root',
})
export class BusquedasService {
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

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      (user) =>
        new Usuario(
          user.nombre,
          user.email,
          user.uid,
          '',
          user.img,
          user.google,
          user.role,
          user.cod_pais,
          user.celular,
          user.codigo,
          user.vence,
          user.disponibles,
          user.activo,
          user.created_at,
          user.update_at
        )
    );
  }

  // private transformarHospitales(resultados: any[]): Hospital[] {
  //   return resultados;
  // }

  // private transformarMedicos(resultados: any[]): Medico[] {
  //   return resultados;
  // }

  busquedaGlobal(termino: string) {
    const url = `${base_url}/todo/${termino}`;
    return this.http.get(url, this.getHeaders);
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string) {
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.getHeaders).pipe(
      map((resp: any) => {
        switch (tipo) {
          case 'usuarios':
            return this.transformarUsuarios(resp.resultados);
          // case 'hospitales':
          //   return this.transformarHospitales(resp.resultados);
          // case 'medicos':
          //   return this.transformarMedicos(resp.resultados);

          default:
            return [];
        }
      })
    );
  }
}
