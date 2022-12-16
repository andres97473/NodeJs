import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Notificacion } from '../../models/notificacion.model';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
})
export class NotificacionesComponent implements OnInit {
  public cargando = true;
  public resultados = 0;
  public desde: number = 0;

  constructor(public notificacionesService: NotificacionesService) {}

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    this.cargando = true;

    this.notificacionesService
      .getNotificaciones(this.desde)
      .subscribe(({ novistos, total, notificaciones }) => {
        this.notificacionesService.novistos = novistos;
        this.notificacionesService.total = total;
        this.notificacionesService.notificaciones = notificaciones;
        this.cargando = false;
        this.resultados = notificaciones.length;
      });
  }

  verNotificacion(notificacion: Notificacion) {
    if (!notificacion.visto) {
      if (notificacion._id) {
        this.notificacionesService
          .verNotificacion(notificacion._id)
          .subscribe((resp) => {
            this.notificacionesService.novistos =
              this.notificacionesService.novistos - 1;
            notificacion.visto = true;
          });
      }
    }
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.notificacionesService.total) {
      this.desde -= valor;
    }
    this.cargarNotificaciones();
  }
}
