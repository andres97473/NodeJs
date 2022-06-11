import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HistoriasService {
  url = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  getHistorias() {
    return this.http.get(`${this.url}historias`);
  }
}
