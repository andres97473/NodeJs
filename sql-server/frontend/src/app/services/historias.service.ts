import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class HistoriasService {
  url = 'http://localhost:3000/';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient
  ) {
    const url2 = this.document.location.href.split('#')[0];
    // console.log(url2);
    // activar localhost dinamico
    //this.url = url2;
  }

  getHistorias() {
    return this.http.get(`${this.url}historias`);
  }
  getHistoriasPaciente(historia: string) {
    return this.http.get(`${this.url}historias/${historia}`);
  }

  getCodigos() {
    return this.http.get(`${this.url}historias-codigos`);
  }

  getEspecialidades() {
    return this.http.get(`${this.url}historias-especialidad`);
  }

  getTipoAtencion() {
    return this.http.get(`${this.url}historias-tipo-atencion`);
  }

  postFirmas(file: any) {
    return this.http.post(`${this.url}historias-firmas`, file, {
      responseType: 'blob',
      observe: 'response',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    });
  }
}
