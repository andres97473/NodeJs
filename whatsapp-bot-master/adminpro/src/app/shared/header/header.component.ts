import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Notificacion } from '../../models/notificacion.model';
import { Router } from '@angular/router';
import { NotificacionesService } from '../../services/notificaciones.service';
import { SocketWebService } from 'src/app/services/socket-web.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent implements OnInit {
  public usuario: Usuario;
  public notificaciones: Notificacion[] = [];
  public novistos = 0;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private notificacionesService: NotificacionesService,
    private socketWebService: SocketWebService
  ) {
    this.usuario = usuarioService.usuario;

    // TODO: notificacion admin
    socketWebService.callback.subscribe((resp) => {
      console.log(resp);
    });

    // TODO: notificacion usuarios
    socketWebService.callbackSol.subscribe((resp) => {
      this.notificacionesService
        .postNotificacion({
          titulo: resp.nombre,
          descripcion: `La Solicitud fue ${resp.estado}`,
          icono: resp.icono,
          color: resp.color,
          usuario: resp.usuario,
        })
        .subscribe((resp: any) => {
          this.notificaciones.unshift(resp.notificacion);
          this.novistos = this.novistos + 1;
        });
      if (resp.disponibles) {
        usuarioService.usuario.disponibles = resp.disponibles;
      } else if (resp.vence) {
        usuarioService.usuario.vence = resp.vence;
      }
    });
  }

  ngOnInit(): void {
    this.notificacionesService.getNotificaciones().subscribe((resp: any) => {
      console.log(resp);
      this.notificaciones = resp.notificaciones;
      this.novistos = resp.novistos;
    });
  }

  logout() {
    this.usuarioService.logout();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.router.navigateByUrl(`/dashboard`);
    } else {
      this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
    }
  }

  verNotificacion(notificacion: Notificacion) {
    if (!notificacion.visto) {
      if (notificacion._id) {
        this.notificacionesService
          .verNotificacion(notificacion._id)
          .subscribe((resp) => {
            this.novistos = this.novistos - 1;
            notificacion.visto = true;
          });
      }
    }
  }
}
