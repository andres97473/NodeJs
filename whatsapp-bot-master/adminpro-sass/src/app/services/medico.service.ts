import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
  constructor(private http: HttpClient) {}

  get getToken(): string {
    return localStorage.getItem('token') || '';
  }

  get getHeaders() {
    return {
      headers: {
        'x-token': this.getToken,
      },
    };
  }

  cargarMedicos() {
    const url = `${base_url}/medicos`;
    return this.http
      .get<{ ok: boolean; medicos: Medico[] }>(url, this.getHeaders)
      .pipe(
        map((resp) => {
          return resp.medicos;
        })
      );
  }

  obtenerMedicoPorId(id: string) {
    const url = `${base_url}/medicos/${id}`;
    return this.http
      .get<{ ok: boolean; medico: Medico }>(url, this.getHeaders)
      .pipe(map((resp) => resp.medico));
  }

  crearMedico(medico: { nombre: string; hospital: string }) {
    const url = `${base_url}/medicos`;
    return this.http.post(url, medico, this.getHeaders);
  }

  actualizarMedico(medico: Medico) {
    const url = `${base_url}/medicos/${medico._id}`;
    return this.http.put(url, medico, this.getHeaders);
  }

  borrarMedico(_id: string) {
    const url = `${base_url}/medicos/${_id}`;
    return this.http.delete(url, this.getHeaders);
  }
}
