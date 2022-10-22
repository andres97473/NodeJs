import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Notificacion } from '../../models/notificacion';
import { Router } from '@angular/router';
import { NotificacionesService } from '../../services/notificaciones.service';

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
    private usuarioService: UsuarioService,
    private notificacionesService: NotificacionesService,
    private router: Router
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.notificacionesService.getNotificaciones().subscribe((resp) => {
      console.log(resp);
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
}
