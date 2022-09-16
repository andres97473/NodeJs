import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { MensajesService } from '../../services/mensajes.service';

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

  public maximo = 50;

  constructor(
    private fb: FormBuilder,
    private mensajesService: MensajesService,
    private usuarioService: UsuarioService
  ) {
    this.usuario = usuarioService.usuario;
    this.iniciarFormulario();
  }

  ngOnInit(): void {}

  iniciarFormulario() {
    this.pruebaForm = this.fb.group({
      token: [this.usuario.uid, [Validators.required]],
      mensaje: [localStorage.getItem('smsprueba') || '', [Validators.required]],
      celular: [this.usuario.celular],
      repeticiones: [1],
    });
  }

  guardarEnMemoria() {
    const { mensaje } = this.pruebaForm.value;
    localStorage.setItem('smsprueba', mensaje);
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Mensaje almacenado en Memoria',
      showConfirmButton: false,
      timer: 2000,
    });
  }

  sendPrueba() {
    this.errorPrueba = '';
    const { repeticiones } = this.pruebaForm.value;
    if (repeticiones < 1) {
      this.errorPrueba = '*Debe enviar al menos un mensaje';
    } else if (repeticiones > this.maximo) {
      this.errorPrueba = `*No puede enviar mas de ${this.maximo} mensajes en esta prueba`;
    } else {
      // console.log(this.pruebaForm.value);
      this.mensajesService.sendMessagePrueba(this.pruebaForm.value).subscribe(
        (resp: any) => {
          // console.log(resp);
          Swal.fire(`Envio exitoso a ${resp.celular}`, resp.msg, 'success');
        },
        (err) => {
          // console.log(err);
          Swal.fire(`Error`, err.error.msg, 'error');
        }
      );
    }
  }
}
