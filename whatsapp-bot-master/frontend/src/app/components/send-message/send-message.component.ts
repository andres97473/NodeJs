import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Respuesta } from '../../models/recordatorio.model';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css'],
})
export class SendMessageComponent implements OnInit {
  to: any;
  message: any;

  respuesta = '';
  enviado = false;

  URL = 'http://localhost:9000/send';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  sendMessage(nTo: any, nMessage: any) {
    //console.log(this.to, this.message);

    this.http
      .post(this.URL, {
        to: nTo,
        message: nMessage,
      })
      .subscribe(
        (res) => {
          //console.log('Mensaje enviado !!');
          console.log(res);
          this.respuesta = (res as Respuesta).status;
          this.enviado = (res as Respuesta).send;
          console.log(this.respuesta, this.enviado);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  sendMessageButton() {
    this.sendMessage(this.to, this.message);
  }

  sendMessagesPrueba() {
    const number1 = '3226798392';
    const number2 = '3176996191';
    const number3 = '31769';

    const msg1 = 'Hola como estas';
    const msg2 = 'Esta es una prueba';
    const msg3 = 'de envio de mensajes';

    console.log('prueba boton');
    this.sendMessage(number1, msg1);
    this.sendMessage(number2, msg1);
    this.sendMessage(number3, msg1);
    this.sendMessage(number1, msg2);
    this.sendMessage(number2, msg2);
    this.sendMessage(number3, msg2);
    this.sendMessage(number1, msg3);
    this.sendMessage(number2, msg3);
    this.sendMessage(number3, msg3);
  }
}
