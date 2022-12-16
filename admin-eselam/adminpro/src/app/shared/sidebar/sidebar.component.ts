import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit {
  public usuario: Usuario;

  constructor(
    public sidebarService: SidebarService,
    private _usuarioService: UsuarioService
  ) {
    // this.menuItems = sidebarService.menu;
    this.usuario = _usuarioService.usuario;
  }

  ngOnInit(): void {}

  logout() {
    Swal.fire({
      title: 'Esta seguro que desea cerrar sesion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si Cerrar Sesion',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this._usuarioService.logout();
      }
    });
  }
}
