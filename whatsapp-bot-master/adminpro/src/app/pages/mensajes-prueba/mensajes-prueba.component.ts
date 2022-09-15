import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-mensajes-prueba',
  templateUrl: './mensajes-prueba.component.html',
  styles: [],
})
export class MensajesPruebaComponent implements OnInit {
  public usuario: Usuario;
  public pruebaForm!: FormGroup;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {
    this.usuario = usuarioService.usuario;
    this.iniciarFormulario();
  }

  ngOnInit(): void {}

  iniciarFormulario() {
    this.pruebaForm = this.fb.group({
      token: [this.usuario.uid, [Validators.required]],
      celular: [this.usuario.celular],
      repeticiones: [1],
      mensaje: [this.usuario.nombre, [Validators.required]],
    });
  }

  sendPrueba() {
    console.log(this.pruebaForm.value);
  }
}
