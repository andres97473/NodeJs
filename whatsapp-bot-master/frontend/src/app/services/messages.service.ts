import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  to: any;
  message: any;

  URL = 'http://localhost:9000/send';


  constructor(private http: HttpClient) { }

  sendMessage(nTo: any, nMessage: any) {
    //console.log(this.to, this.message);

    this.http
      .post(this.URL, {
        to: nTo,
        message: nMessage,
      })
      .subscribe(
        (res) => {
          console.log('Mensaje enviado !!');
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  
}
