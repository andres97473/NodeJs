import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetClientesI, ClienteI } from '../interface/cliente.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  get getHeaders() {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  getClientes() {
    return this.http.get<GetClientesI>(`${this.URL}/api/clientes`);
  }

  crearCliente(data: any) {
    return this.http.post(`${this.URL}/api/clientes/`, data);
  }

  actualizarCliente(data: any, id: string) {
    return this.http.put<any>(`${this.URL}/api/clientes/${id}`, data);
  }

  borrarCliente(id: string) {
    return this.http.delete(`${this.URL}/api/clientes/${id}`);
  }
}
