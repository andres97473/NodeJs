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
  public formSubmitted = false;
  public errorPrueba = '';

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {
    this.usuario = usuarioService.usuario;
    this.iniciarFormulario();
  }

  ngOnInit(): void {}

  iniciarFormulario() {
    this.pruebaForm = this.fb.group({
      token: [this.usuario.uid, [Validators.required]],
      mensaje: ['', [Validators.required]],
      celular: [this.usuario.celular],
      repeticiones: [1],
    });
  }

  guardarEnMemoria() {
    console.log('memoria');
  }

  sendPrueba() {
    this.errorPrueba = '';
    const { repeticiones } = this.pruebaForm.value;
    if (repeticiones < 1) {
      this.errorPrueba = '*Debe enviar al menos un mensaje';
    } else if (repeticiones > 100) {
      this.errorPrueba = '*No puede enviar mas de 100 mensajes en esta prueba';
    } else {
      console.log(this.pruebaForm.value);
    }
  }
}
