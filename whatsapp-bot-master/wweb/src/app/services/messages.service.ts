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
    celular: any,
    user_id: any
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
      user_id,
    });
  }
  sendRecordatorioFijo(
    num_doc_usr: any,
    tipo_doc: any,
    apellido1: any,
    apellido2: any,
    nombre1: any,
    nombre2: any,
    celular: any,
    mensaje: any
  ) {
    //console.log(this.to, this.message);

    return this.http.post(`${this.URL}/recordatorio-fijo`, {
      num_doc_usr,
      tipo_doc,
      apellido1,
      apellido2,
      nombre1,
      nombre2,
      celular,
      mensaje,
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

  sendMessageToken(celulares: number[], mensaje: string, token: string) {
    //console.log(this.to, this.message);

    return this.http.post(`${this.URL}/send-message-token`, {
      celulares,
      mensaje,
      token,
    });
  }
}
