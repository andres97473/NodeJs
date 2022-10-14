import { Component, Input, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { SesionService } from '../../services/sesion.service';

@Component({
  selector: 'app-modal-sesion',
  templateUrl: './modal-sesion.component.html',
  styleUrls: ['./modal-sesion.component.css'],
})
export class ModalSesionComponent implements OnInit {
  @Input() sesionTime: number = 10;
  @Input() progreso = 100;

  constructor(
    private usuarioService: UsuarioService,
    public sesionService: SesionService
  ) {}

  ngOnInit(): void {}

  cerrarModal() {
    this.sesionService.ocultar = true;
  }

  permanecerConectado() {
    this.sesionService.ocultar = true;
    this.sesionService.time = this.sesionService.getSegundos;
  }

  logout() {
    this.sesionService.ocultar = true;
    this.usuarioService.logout();
  }
}
