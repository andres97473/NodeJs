import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const headers = new HttpHeaders().set('Content-Type', 'application/json');

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  constructor(private http: HttpClient) {}

  findBranchesLocation(body: any) {
    const url = 'http://localhost:3000/api/branch/location';
    return this.http.post(url, body, { headers });
  }
}
