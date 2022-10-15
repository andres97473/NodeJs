import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  download() {
    return this.http.get('http://localhost:3001/download', {
      responseType: 'blob',
      reportProgress: true,
      observe: 'events',
    });
  }

  upload(file: File) {
    const multipartFormData = new FormData();
    multipartFormData.append('file', file);

    return this.http.post('http://localhost:3001/upload', multipartFormData, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
