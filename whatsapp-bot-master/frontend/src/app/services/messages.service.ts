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

  URL = 'http://localhost:9000/send';

  constructor(private http: HttpClient) {}

  sendMessage(nTo: any, nMessage: any) {
    //console.log(this.to, this.message);

    return this.http.post(this.URL, {
      to: nTo,
      message: nMessage,
    });
  }
}
