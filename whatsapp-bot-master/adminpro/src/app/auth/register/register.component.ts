import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';
import { SesionService } from '../../services/sesion.service';
import { PaisI } from '../../interface/pais.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public formSubmitted = false;
  public paises: PaisI[] = [];

  public registerForm = this.fb.group(
    {
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cod_pais: ['', [Validators.required]],
      celular: ['', [Validators.minLength(7)]],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      terminos: [, [Validators.required, Validators.requiredTrue]],
    },
    {
      validators: this.passwordsIguales('password', 'password2'),
    }
  );

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private sesionService: SesionService
  ) {}

  ngOnInit(): void {
    this.usuarioService.getPaises().subscribe((resp) => {
      this.paises = resp.paises;
    });

    this.registerForm.controls['cod_pais'].setValue('+57');
  }

  verTerminos() {
    Swal.fire({
      text: 'Este aplicacion utiliza whatsapp web para el envio de mensajes, nos regimos a los terminos de uso de whatsapp',
    });
  }

  crearUsuario() {
    this.formSubmitted = true;
    // console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
      return;
    }
    // realizar el posteo
    this.usuarioService.crearUsuario(this.registerForm.value).subscribe(
      (resp) => {
        // console.log(resp);
        this.router.navigateByUrl('/');
        this.sesionService.time = this.sesionService.getSegundos;
        this.sesionService.ocultar = true;
      },
      (err) => {
        console.warn(err.error);
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  campoNoValido(campo: string): boolean {
    const nCampo = this.registerForm.get(campo);

    if (nCampo) {
      if (nCampo.invalid && this.formSubmitted) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  aceptaTerminos() {
    const check = this.registerForm.get('terminos')?.value;
    if (!check && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    if (pass1 !== pass2 && this.formSubmitted) {
      return true;
    } else {
      return false;
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
}
