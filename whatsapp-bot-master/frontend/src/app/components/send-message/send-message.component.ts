import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css'],
})
export class SendMessageComponent implements OnInit {
  to: any;
  message: any;

  URL = 'http://localhost:9000/send';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  sendMessage(forma: NgForm) {
    //console.log(this.to, this.message);

    this.http
      .post(this.URL, {
        to: this.to,
        message: this.message,
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
