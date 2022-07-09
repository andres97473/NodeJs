import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public formSubmitted = false;

  public errorIdentificacion = false;
  public errorPassword = false;

  public loginForm = this.fb.group({
    identificacion: [
      localStorage.getItem('identificacion') || '',
      [Validators.required],
    ],
    contraseña: ['', [Validators.required]],
    remember: [Boolean(localStorage.getItem('remember')) || false],
  });

  constructor(
    private fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private router: Router
  ) {}
  ngOnInit(): void {}

  login() {
    this.formSubmitted = true;
    // this.router.navigateByUrl('/');
    // console.log(this.loginForm.value);
    this._usuarioService.login(this.loginForm.value).subscribe(
      (resp) => {
        // console.log(resp);
        const remember = this.loginForm.get('remember')?.value;
        const identificacion = this.loginForm.get('identificacion')?.value;
        if (remember) {
          localStorage.setItem('identificacion', identificacion);
          localStorage.setItem('remember', 'true');
        } else {
          localStorage.removeItem('identificacion');
          localStorage.removeItem('remember');
        }

        // mover al dashboard
        this.router.navigateByUrl('/');
      },
      (err) => {
        if (err.error.message) {
          Swal.fire('Error', err.error.message, 'error');
        } else {
          if (err.error.errors.contraseña) {
            this.errorPassword = true;
          }
          if (err.error.errors.identificacion) {
            this.errorIdentificacion = true;
          }
          // console.log(err.error.errors.contraseña);
        }
      }
    );
  }
}
