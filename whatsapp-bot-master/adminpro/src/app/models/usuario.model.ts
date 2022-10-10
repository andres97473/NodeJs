import { environment } from '../../environments/environment';

export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public uid?: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: string,
    public cod_pais?: string,
    public celular?: string,
    public codigo?: string,
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

  get getCodigo() {
    return this.codigo;
  }

  get getCodigoPais() {
    return this.cod_pais;
  }

  get getVence() {
    return this.vence;
  }

  get getDisponibles() {
    return this.disponibles;
  }
}
