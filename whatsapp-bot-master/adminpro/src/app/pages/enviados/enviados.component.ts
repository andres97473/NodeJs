import { Component, OnInit } from '@angular/core';
import { Mensaje, Columna } from '../../interface/mensajes.interface';
import { MensajesService } from '../../services/mensajes.service';

@Component({
  selector: 'app-enviados',
  templateUrl: './enviados.component.html',
  styles: [],
})
export class EnviadosComponent implements OnInit {
  mensajes: Mensaje[] = [];
  nombres: string[] = ['celular', 'mensaje', 'tipo', 'created_at'];
  columnas: Columna[] = [
    { titulo: 'Celular', name: 'celular' },
    { titulo: 'Mensaje', name: 'mensaje' },
    { titulo: 'Tipo', name: 'tipo' },
    { titulo: 'Enviado', name: 'created_at' },
  ];

  constructor(private mensajesService: MensajesService) {}

  ngOnInit(): void {
    this.mensajesService.getMensajes().subscribe((resp: any) => {
      // console.log(resp);

      this.mensajes = resp.mensajes;
    });
  }
}
