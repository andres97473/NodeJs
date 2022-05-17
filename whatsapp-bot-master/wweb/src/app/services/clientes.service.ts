import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetClientesI } from '../interface/cliente.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  URL = 'http://localhost:9000';

  constructor(private http: HttpClient) {}

  getClientes() {
    return this.http.get<GetClientesI>(`${this.URL}/api/clientes`);
  }

  borrarCliente(id: string) {
    return this.http.delete(`${this.URL}/api/clientes/${id}`);
  }
}
