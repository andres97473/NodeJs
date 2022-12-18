import { environment } from '../../environments/environment';

export class Usuario {
  constructor(
    public num_documento: string,
    public tipo_doc: string,
    public email: string,
    public apellido1?: string,
    public apellido2?: string,
    public nombre1?: string,
    public nombre2?: string,
    public celular?: string,
    public img?: string,
    public role?: string,
    public modulos?: object,
    public password?: string,
    public activo?: boolean,
    public created_at?: Date,
    public update_at?: Date,
    public uid?: string
  ) {}

  // imprimirUsuario() {
  //   console.log(this.nombre);
  // }

  get imprimirUsuario() {
    return console.log(this.nombre1);
  }

  get getToken() {
    return this.uid;
  }

  get getRole() {
    return this.role;
  }

  get getModulos() {
    return this.modulos;
  }
}
