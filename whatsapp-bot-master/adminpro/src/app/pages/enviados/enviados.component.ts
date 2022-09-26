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
  nombres: string[] = ['created_at', 'celular', 'mensaje', 'tipo'];
  columnas: Columna2[] = [
    { titulo: 'Enviado', field: 'created_at', width: 20 },
    { titulo: 'Celular', field: 'celular', width: 20 },
    { titulo: 'Mensaje', field: 'mensaje', width: 60 },
    { titulo: 'Tipo', field: 'tipo', width: 20 },
  ];

  constructor(private mensajesService: MensajesService) {}

  ngOnInit(): void {
    this.mensajesService.getMensajes().subscribe((resp: any) => {
      // console.log(resp);
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
    });
  }
}
