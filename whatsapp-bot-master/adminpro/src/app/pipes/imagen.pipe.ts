import { DOCUMENT } from '@angular/common';
import { Inject, Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

let base_url = 'http://localhost:3000/api';
const produccion = environment.produccion;

@Pipe({
  name: 'imagen',
})
export class ImagenPipe implements PipeTransform {
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.getUrl();
  }

  getUrl() {
    if (produccion) {
      base_url = this.document.location.href.split('3000')[0] + '3000/api';
    }
  }

  transform(img?: string, tipo?: 'usuarios' | 'solicitudes'): string {
    if (!img) {
      return `${base_url}/upload/${tipo}/no-image`;
    } else if (img?.includes('https')) {
      return img;
    } else if (img) {
      return `${base_url}/upload/${tipo}/${img}`;
    } else {
      return `${base_url}/upload/${tipo}/no-image`;
    }
  }
}
