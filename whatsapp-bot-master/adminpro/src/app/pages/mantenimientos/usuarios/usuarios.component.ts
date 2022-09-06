import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';

import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit {
  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public resultados = 0;
  public cargando = true;

  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;

    this.usuarioService
      .cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
        this.resultados = usuarios.length;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscarUsuarios(termino: string) {
    if (termino.length === 0) {
      return (this.usuarios = this.usuariosTemp);
    } else {
      return this.busquedasService
        .buscar('usuarios', termino)
        .subscribe((resultados) => {
          this.usuarios = resultados;
        });
    }
  }

  eliminarUsuario(usuario: Usuario) {
    if (usuario.uid === this.usuarioService.getUid) {
      return Swal.fire('Error', 'No puede borrar su propio usuario', 'error');
    } else {
      return Swal.fire({
        title: '¿Borrar Usuario?',
        text: `Esta a punto de borrar a ${usuario.nombre}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, Borrar usuario!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuarioService.eliminarUsuario(usuario).subscribe((resp) => {
            Swal.fire(
              'Usuario Borrado',
              `${usuario.nombre} fue eliminado correctamente`,
              'success'
            );
            this.cargarUsuarios();
          });
        }
      });
    }
  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario).subscribe((resp) => {
      console.log(resp);
    });
  }
}
