import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Usuario } from '../../models/usuario.model';
import { MensajesService } from '../../services/mensajes.service';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mensajes-envio',
  templateUrl: './mensajes-envio.component.html',
  styles: [],
})
export class MensajesEnvioComponent implements OnInit {
  public usuario: Usuario;
  public mensajeForm!: FormGroup;
  public formSubmitted = false;
  public errorMessage = '';

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
    this.mensajeForm = this.fb.group({
      token: [this.usuario.uid, [Validators.required]],
      mensaje: [localStorage.getItem('smsenvio') || '', [Validators.required]],
      celulares: ['3166651382,3166651382,3166651382', [Validators.required]],
      vence: [this.usuario.vence || ''],
      disponibles: [this.usuario.disponibles || ''],
    });
  }

  guardarEnMemoria() {
    const { mensaje } = this.mensajeForm.value;
    localStorage.setItem('smsenvio', mensaje);
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Mensaje almacenado en Memoria',
      showConfirmButton: false,
      timer: 2000,
    });
  }

  copyToClipBoard() {
    let content: any = document.getElementById('tokentxt');

    content.select();
    document.execCommand('copy');
  }

  sendMessage() {
    this.errorMessage = '';
    let { token, mensaje, celulares, vence, disponibles } =
      this.mensajeForm.value;
    const nCelulares: string[] = celulares.split(',');
    if (nCelulares.length < 1) {
      this.errorMessage = '*Debe enviar al menos un mensaje';
    } else if (nCelulares.length > this.maximo) {
      this.errorMessage = `*No puede enviar mas de ${this.maximo} mensajes en esta prueba`;
    } else {
      this.mensajesService.sendMessageToken(this.mensajeForm.value).subscribe(
        (resp: any) => {
          this.usuarioService.usuario.disponibles = resp.disponibles;
          this.mensajeForm.setValue({
            token,
            mensaje,
            celulares,
            vence,
            disponibles: resp.disponibles,
          });
          Swal.fire(`Envio exitoso`, resp.msg, 'success');
        },
        (err) => {
          // console.log(err);
          Swal.fire(`Error`, err.error.msg, 'error');
        }
      );
    }
  }
}
