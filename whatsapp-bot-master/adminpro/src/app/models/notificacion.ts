export class Notificacion {
  constructor(
    public titulo: string,
    public descripcion: string,
    public icono: number,
    public visto: boolean,
    public usuario: string,
    public created_at?: Date,
    public update_at?: Date
  ) {}
}
