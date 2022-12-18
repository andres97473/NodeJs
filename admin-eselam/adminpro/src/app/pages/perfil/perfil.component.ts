import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';

import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [],
})
export class PerfilComponent implements OnInit {
  public usuario: Usuario;
  public perfilForm!: FormGroup;
  public imagenSubir?: File;
  public imgTemp: any = null;
  public formSubmitted = false;
  public errorPassword = '';
  public codPais = '';

  public passwordForm = this.fb.group(
    {
      password: [''],
      password2: [''],
    },
    {
      validators: this.passwordsIguales('password', 'password2'),
    }
  );

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
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;

    this.iniciarFormulario();
  }

  ngOnInit(): void {}

  iniciarFormulario() {
    this.perfilForm = this.fb.group({
      num_documento: [this.usuario.num_documento, [Validators.required]],
      tipo_doc: [this.usuario.tipo_doc, [Validators.required]],
      nombre1: [this.usuario.nombre1, [Validators.required]],
      nombre2: [this.usuario.nombre2],
      apellido1: [this.usuario.apellido1, [Validators.required]],
      apellido2: [this.usuario.apellido2],
      email: [this.usuario.email, [Validators.required, Validators.email]],
      celular: [this.usuario.celular],
    });
  }

  actualizarPerfil() {
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe(
      (resp: any) => {
        // console.log(resp);
        const { nombre1, nombre2, apellido1, apellido2, email, celular } =
          resp.usuario;
        this.usuario.nombre1 = nombre1;
        this.usuario.nombre2 = nombre2;
        this.usuario.apellido1 = apellido1;
        this.usuario.apellido2 = apellido2;
        this.usuario.email = email;
        this.usuario.celular = celular;

        Swal.fire('Guardado', 'Los cambios fueron guardados', 'success');
      },
      (err) => {
        // console.log(err.error.msg);
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  cambiarImagen(event: any): any {
    const file = event.target.files[0];
    this.imagenSubir = file;
    this.message = null;
    this.enviado = false;
    this.value = 0;
    // console.log(this.imagenSubir);

    // si se selecciona imagen cambiar la vista por la nueva imagen
    if (!file) {
      return (this.imgTemp = null);
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      // console.log(reader.result);
    };
  }

  subirImagen() {
    if (this.imagenSubir && this.usuario.uid) {
      this.fileUploadService
        .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
        .pipe()
        .subscribe(
          (resp: any) => {
            this.message = null;
            this.enviado = true;

            if (resp['loaded'] && resp['total']) {
              this.value = Math.round((resp['loaded'] / resp['total']) * 100);
            }

            if (resp['body']) {
              this.message = resp['body'].msg;
            }

            if (this.message) {
              this.usuario.img = resp['body'].nombreArchivo;
              Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
            }
          },
          (err) => {
            console.log(err);
            Swal.fire('Error', 'No se pudo subir la imagen', 'error');
          }
        );
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null);
      } else {
        pass2Control?.setErrors({ noEsIgual: true });
      }
    };
  }

  contrasenasNoValidas() {
    const pass1 = this.passwordForm.get('password')?.value;
    const pass2 = this.passwordForm.get('password2')?.value;

    if (pass1 !== pass2 && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  cambiarPassword() {
    this.formSubmitted = true;
    const { password, password2 } = this.passwordForm.value;
    if (password.length < 5) {
      this.errorPassword = '*Las contraseña debe tener al menos 5 caracteres';
      this.passwordForm.invalid;
    } else if (password !== password2) {
      this.errorPassword = '*Las contraseñas deben ser iguales';
      this.passwordForm.invalid;
    } else {
      // TODO:
      this.usuarioService
        .actualizarPassword(password)
        .subscribe((resp: any) => {
          // console.log(resp);
          this.passwordForm.reset();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: resp.msg,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    }
  }
}
