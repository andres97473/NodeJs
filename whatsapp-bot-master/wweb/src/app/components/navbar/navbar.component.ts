import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  usuario: any;
  constructor(
    private _usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // TODO: obtener usuario
    this.usuario = this.getUsuarioStorage();
  }

  getUsuarioStorage() {
    const usuario = localStorage.getItem('usuario');

    if (usuario) {
      return JSON.parse(usuario);
    }
    return null;
  }

  logout() {
    this._usuarioService.logout();
    // mover al dashboard
    this.router.navigateByUrl('/login');
  }
}
