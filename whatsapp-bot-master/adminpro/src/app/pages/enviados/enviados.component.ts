import { Component, OnInit } from '@angular/core';
import { Mensaje, Columna, Columna2 } from '../../interface/mensajes.interface';
import { MensajesService } from '../../services/mensajes.service';

@Component({
  selector: 'app-enviados',
  templateUrl: './enviados.component.html',
  styles: [],
})
export class EnviadosComponent implements OnInit {
  mensajes: Mensaje[] = [];
  nombres: string[] = ['cod_pais', 'created_at', 'celular', 'mensaje', 'tipo'];
  columnas: Columna2[] = [
    { titulo: 'Codigo Pais', field: 'cod_pais', width: 20 },
    { titulo: 'Enviado', field: 'created_at', width: 20 },
    { titulo: 'Celular', field: 'celular', width: 20 },
    { titulo: 'Mensaje', field: 'mensaje', width: 60 },
    { titulo: 'Tipo', field: 'tipo', width: 20 },
  ];
  mensajesTotal = 0;
  mensajesArchivo = 0;
  mensajesPrueba = 0;
  mensajesMensaje = 0;

  constructor(private mensajesService: MensajesService) {}

  ngOnInit(): void {
    this.mensajesService.getMensajes().subscribe(
      (resp: any) => {
        const formateador = new Intl.DateTimeFormat('es-MX', {
          dateStyle: 'short',
          timeStyle: 'short',
          hour12: true,
        });
        resp.mensajes.map(
          (m: Mensaje) =>
            (m.created_at = formateador.format(new Date(m.created_at)))
        );
        this.mensajes = resp.mensajes;
        this.mensajesTotal = resp.total;
        this.mensajesArchivo = resp.archivo;
        this.mensajesPrueba = resp.prueba;
        this.mensajesMensaje = resp.mensaje;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
