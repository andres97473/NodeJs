export class Solicitud {
  constructor(
    public usuario: string,
    public nombre: string,
    public descripcion: string,
    public valor: number,
    public tipo: number,
    public _id?: string,
    public estado?: string,
    public vence?: number,
    public disponibles?: number,
    public soporte_pago?: string,
    public usr_aprueba?: string
  ) {}
}
