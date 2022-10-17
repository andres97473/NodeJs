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
  public enviados = 0;
  public fechaEnvio?: Date;

  public maximo = 50;

  public message: any;
  public enviado = false;
  public enviando = false;
  private _value: number = 0;

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    if (!isNaN(value) && value <= 100) {
      this._value = value;
    }
  }

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
      repeticiones: [1, [Validators.required]],
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

  copyToClipBoard() {
    let content: any = document.getElementById('tokentxt');

    content.select();
    document.execCommand('copy');
  }

  sendPrueba() {
    this.enviado = true;
    this.enviando = true;
    this.message = null;
    this.errorPrueba = '';
    const { repeticiones } = this.pruebaForm.value;
    if (repeticiones < 1) {
      this.errorPrueba = '*Debe enviar al menos un mensaje';
      this.enviando = false;
      this.enviado = false;
    } else if (repeticiones > this.maximo) {
      this.errorPrueba = `*No puede enviar mas de ${this.maximo} mensajes en esta prueba`;
      this.enviando = false;
      this.enviado = false;
    } else {
      // console.log(this.pruebaForm.value);
      this.mensajesService
        .sendMessagePrueba(this.pruebaForm.value)
        .pipe()
        .subscribe(
          (resp: any) => {
            this.message = null;

            if (resp['loaded'] && resp['total']) {
              this.value = Math.round((resp['loaded'] / resp['total']) * 100);
            }

            if (resp['body']) {
              this.message = resp['body'].msg;
            }

            if (this.message) {
              this.enviando = false;

              this.enviados = resp['body'].enviados;
              this.fechaEnvio = new Date();
            }

            // console.log(resp['body']);
          },
          (err) => {
            // console.log(err);
            Swal.fire(`Error`, err.error.msg, 'error');
          }
        );
    }
  }
}
