import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
  constructor(private http: HttpClient) {}

  sendMessagePrueba(formData: any) {
    return this.http.post(`${base_url}/send-message-prueba`, formData);
  }

  sendMessageToken(formData: any) {
    return this.http.post(`${base_url}/send-message-token`, formData);
  }

  sendMessageImg(formData: any) {
    return this.http.post(`${base_url}/send-message-img`, formData);
  }
}
