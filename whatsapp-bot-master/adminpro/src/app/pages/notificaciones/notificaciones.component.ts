import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Notificacion } from '../../models/notificacion.model';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
})
export class NotificacionesComponent implements OnInit {
  public novistos = 0;
  public notificaciones: Notificacion[] = [];
  public notificacionesTemp: Notificacion[] = [];
  public cargando = true;
  public resultados = 0;
  public desde: number = 0;

  constructor(private notificacionesService: NotificacionesService) {}

  ngOnInit(): void {
    this.cargarNotificaiones();
  }

  cargarNotificaiones() {
    this.cargando = true;

    this.notificacionesService
      .getNotificaciones(this.desde)
      .subscribe(({ novistos, notificaciones }) => {
        this.novistos = novistos;
        this.notificaciones = notificaciones;
        this.notificacionesTemp = notificaciones;
        this.cargando = false;
        this.resultados = notificaciones.length;

        console.log(this.resultados);
        console.log(this.novistos);
        console.log(this.notificaciones);
      });
  }
}
