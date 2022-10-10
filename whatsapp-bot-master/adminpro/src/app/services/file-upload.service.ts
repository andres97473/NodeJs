import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';

let base_url = 'http://localhost:3000/api';
const produccion = environment.produccion;

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.getUrl();
  }

  getUrl() {
    if (produccion) {
      base_url = this.document.location.href.split('3000')[0] + '3000/api';
    }
  }

  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'solicitudes',
    id: string
  ) {
    try {
      const url = `${base_url}/upload/${tipo}/${id}`;

      // crear el form data con la imagen, se pueden enviar mas propiedasdes
      const formData = new FormData();
      formData.append('imagen', archivo);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || '',
        },
        body: formData,
      });

      const data = await resp.json();
      // console.log(data);
      if (data.ok) {
        return data.nombreArchivo;
      } else {
        console.log(data.msg);

        return false;
      }
    } catch (error) {
      console.log(error);

      return false;
    }
  }
}
