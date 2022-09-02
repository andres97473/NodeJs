import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public formSubmitted = false;

  public checkRemember = localStorage.getItem('email') ? true : false;

  public loginForm = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
    password: ['', Validators.required],
    remember: [this.checkRemember],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  login() {
    // this.router.navigateByUrl('/');
    // console.log(this.loginForm.value);
    this.usuarioService.login(this.loginForm.value).subscribe(
      (resp) => {
        // console.log(resp);
        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem('email', this.loginForm.get('email')?.value);
        } else {
          localStorage.removeItem('email');
        }
      },
      (err) => {
        // console.warn(err.error);
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }
}
