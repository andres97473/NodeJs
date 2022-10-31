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

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    public notificacionesService: NotificacionesService,
    private socketWebService: SocketWebService
  ) {
    this.usuario = usuarioService.usuario;

    // TODO: notificacion admin
    socketWebService.callback.subscribe((resp) => {
      this.notificacionesService
        .postNotificacion({
          titulo: resp.nombre,
          descripcion: `La Solicitud fue ${resp.estado}`,
          icono: resp.icono,
          color: resp.color,
          usuario: resp.usuario,
        })
        .subscribe((resp: any) => {
          const {
            color,
            created_at,
            descripcion,
            icono,
            titulo,
            update_at,
            visto,
            _id,
          } = resp.notificacion;

          this.notificacionesService.notificaciones.unshift({
            color,
            created_at,
            descripcion,
            icono,
            titulo,
            update_at,
            visto,
            _id,
            usuario: resp.usuario,
          });
          this.notificacionesService.novistos =
            this.notificacionesService.novistos + 1;
        });
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
          const {
            color,
            created_at,
            descripcion,
            icono,
            titulo,
            update_at,
            visto,
            _id,
          } = resp.notificacion;

          this.notificacionesService.notificaciones.unshift({
            color,
            created_at,
            descripcion,
            icono,
            titulo,
            update_at,
            visto,
            _id,
            usuario: resp.usuario,
          });
          this.notificacionesService.novistos =
            this.notificacionesService.novistos + 1;
        });
      if (resp.disponibles) {
        usuarioService.usuario.disponibles = resp.disponibles;
      } else if (resp.vence) {
        usuarioService.usuario.vence = resp.vence;
      }
    });
  }

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    this.notificacionesService.getNotificaciones().subscribe((resp: any) => {
      this.notificacionesService.notificaciones = resp.notificaciones;
      this.notificacionesService.novistos = resp.novistos;
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
            this.notificacionesService.novistos =
              this.notificacionesService.novistos - 1;
            notificacion.visto = true;
            if (notificacion.descripcion.includes('APROBADA')) {
              this.router
                .navigateByUrl('/dashboard/planes')
                .then(() => this.router.navigate(['dashboard/solicitudes']));
            } else if (
              notificacion.descripcion.includes('ENVIADA') &&
              this.usuario.getRole === 'ADMIN_ROLE'
            ) {
              this.router
                .navigateByUrl('/dashboard/planes')
                .then(() =>
                  this.router.navigate(['dashboard/solicitudes-admin'])
                );
            }
          });
      }
    }
  }
}
