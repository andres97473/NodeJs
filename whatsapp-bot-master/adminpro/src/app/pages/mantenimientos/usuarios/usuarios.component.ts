import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit {
  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.cargarUsuarios(0).subscribe(({ total, usuarios }) => {
      // console.log(resp);
      this.totalUsuarios = total;
      this.usuarios = usuarios;
    });
  }
}
