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
    email: [localStorage.getItem('email') || '', [Validators.required]],
    password: ['', [Validators.required]],
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
    //console.log(this.loginForm.value);
    this._usuarioService.login(this.loginForm.value).subscribe(
      (resp) => {
        // console.log(resp);
        const remember = this.loginForm.get('remember')?.value;
        const email = this.loginForm.get('email')?.value;
        if (remember) {
          localStorage.setItem('email', email);
          localStorage.setItem('remember', 'true');
        } else {
          localStorage.removeItem('email');
          localStorage.removeItem('remember');
        }

        // mover al dashboard
        this.router.navigateByUrl('/dashboard');
      },
      (err) => {
        if (err.error.msg) {
          Swal.fire('Error', err.error.msg, 'error');
        } else {
          if (err.error.errors.password) {
            this.errorPassword = true;
          }
          if (err.error.errors.email) {
            this.errorIdentificacion = true;
          }
          // console.log(err.error.errors.contraseña);
        }
      }
    );
  }
}
