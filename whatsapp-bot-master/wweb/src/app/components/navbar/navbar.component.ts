import { Component, Input, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() disponibles = 0;
  usuario: any;
  constructor(
    private _usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // TODO: obtener usuario
    this.usuario = this._usuarioService.getUsuarioLocal();
    this.disponibles = this.usuario.disponibles;
  }

  logout() {
    this._usuarioService.logout();
    // mover al dashboard
    this.router.navigateByUrl('/login');
  }
}
