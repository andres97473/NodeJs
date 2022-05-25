import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, delay } from 'rxjs/operators';
import { Respuesta } from '../models/recordatorio.model';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  to: any;
  message: any;
  respuesta = '';
  enviado = false;

  pageIndex = 0;

  URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  sendMessage(nTo: any, nMessage: any) {
    //console.log(this.to, this.message);

    return this.http.post(`${this.URL}/send`, {
      to: nTo,
      message: nMessage,
    });
  }

  sendRecordatorio(
    num_doc_usr: any,
    tipo_doc: any,
    apellido1: any,
    apellido2: any,
    nombre1: any,
    nombre2: any,
    celular: any
  ) {
    //console.log(this.to, this.message);

    return this.http.post(`${this.URL}/recordatorio`, {
      num_doc_usr,
      tipo_doc,
      apellido1,
      apellido2,
      nombre1,
      nombre2,
      celular,
    });
  }
  sendRecordatorioApp(
    num_doc_usr: any,
    tipo_doc: any,
    apellido1: any,
    apellido2: any,
    nombre1: any,
    nombre2: any,
    celular: any
  ) {
    //console.log(this.to, this.message);

    return this.http.post(`${this.URL}/recordatorio-app`, {
      num_doc_usr,
      tipo_doc,
      apellido1,
      apellido2,
      nombre1,
      nombre2,
      celular,
    });
  }
}
