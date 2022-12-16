export class Notificacion {
  constructor(
    public titulo: string,
    public descripcion: string,
    public icono: string,
    public color: string,
    public usuario: any,
    public visto?: boolean,
    public _id?: string,
    public created_at?: Date,
    public update_at?: Date
  ) {}
}
