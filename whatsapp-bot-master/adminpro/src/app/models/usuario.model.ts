import { environment } from '../../environments/environment';

const base_url = environment.base_url;

export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public uid?: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: string,
    public celular?: string,
    public vence?: string,
    public disponibles?: number,
    public activo?: boolean,
    public created_at?: Date,
    public update_at?: Date
  ) {}

  // imprimirUsuario() {
  //   console.log(this.nombre);
  // }

  get imprimirUsuario() {
    return console.log(this.nombre);
  }

  get getToken() {
    return this.uid;
  }

  get getRole() {
    return this.role;
  }

  get getImagenUrl() {
    if (!this.img) {
      return `${base_url}/upload/usuarios/no-image`;
    } else if (this.img?.includes('https')) {
      return this.img;
    } else if (this.img) {
      return `${base_url}/upload/usuarios/${this.img}`;
    } else {
      return `${base_url}/upload/usuarios/no-image`;
    }
  }
}
