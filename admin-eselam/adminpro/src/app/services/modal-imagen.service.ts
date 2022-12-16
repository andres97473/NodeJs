import { Injectable, EventEmitter, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';

let base_url = 'http://localhost:3000/api';
const produccion = environment.produccion;

@Injectable({
  providedIn: 'root',
})
export class ModalImagenService {
  private _ocultarModal = true;
  private _abrirModal = false;

  get ocultarModal() {
    return this._ocultarModal;
  }

  get ModalAbrir() {
    return this._abrirModal;
  }

  public tipo!: 'usuarios' | 'solicitudes';
  public id!: string;
  public img?: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.getUrl();
  }

  getUrl() {
    if (produccion) {
      base_url = this.document.location.href.split('3000')[0] + '3000/api';
    }
  }

  abrirModal(
    tipo: 'usuarios' | 'solicitudes',
    id: string,
    img: string = 'no-img'
  ) {
    this._ocultarModal = false;
    this._abrirModal = true;
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
