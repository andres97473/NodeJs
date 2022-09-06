import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ModalImagenService {
  private _ocultarModal = true;

  get ocultarModal() {
    return this._ocultarModal;
  }

  public tipo!: 'usuarios' | 'medicos' | 'hospitales';
  public id!: string;
  public img?: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  abrirModal(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string,
    img: string = 'no-img'
  ) {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    // http://localhost:3000/api/upload/usuarios/44159960-ddc2-4032-9b22-0e3c6283e711.jpg}
    if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${base_url}/upload/${tipo}/${img}`;
    }
    // this.img = img;
  }
  cerrarModal() {
    this._ocultarModal = true;
  }
}
