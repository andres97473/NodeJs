import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  NgZone,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { SesionService } from '../../services/sesion.service';
import { Usuario } from '../../models/usuario.model';

// declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted = false;
  public oculto = true;

  public emailVerificado: any;
  public codigoVerificado: any;
  public codigoPaisVerificado: any;
  public celularVerificado: any;

  public msg: any;
  public msgErrorCelular: any;
  public okVerificado: any;

  public checkRemember = localStorage.getItem('email') ? true : false;

  public loginForm = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
    password: ['', Validators.required],
    remember: [this.checkRemember],
  });

  public recoveryform = this.fb.group({
    recoveryEmail: ['', [Validators.required, Validators.email]],
    codigo: [''],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone,
    private sesionService: SesionService
  ) {}
  ngAfterViewInit(): void {
    // this.googleInit();
  }

  cambiarEstado() {
    this.oculto = !this.oculto;

    this.msg = null;
    this.msgErrorCelular = null;
    this.emailVerificado = null;
    this.codigoVerificado = null;
    this.codigoPaisVerificado = null;
    this.celularVerificado = null;
    this.okVerificado = null;

    this.recoveryform.controls['recoveryEmail'].setValue('');
    this.recoveryform.controls['codigo'].setValue('');
  }

  // googleInit() {
  //   google.accounts.id.initialize({
  //     client_id:
  //       '857780671996-i6doqclt4a9itsnsc67mv0assvpmki02.apps.googleusercontent.com',
  //     callback: (response: any) => this.handleCredentialResponse(response),
  //   });
  //   google.accounts.id.renderButton(
  //     // document.getElementById('buttonDiv'),
  //     this.googleBtn.nativeElement,
  //     { theme: 'outline', size: 'large' } // customization attributes
  //   );
  // }

  async handleCredentialResponse(response: any) {
    // console.log({ esto: this });
    // console.log('Encoded JWT ID token: ' + response.credential);
    this.usuarioService.loginGoogle(response.credential).subscribe((resp) => {
      // console.log(resp);
      this.ngZone.run(() => {
        this.router.navigateByUrl('/');
        this.sesionService.time = this.sesionService.getSegundos;
        this.sesionService.ocultar = true;
      });
    });
  }

  login() {
    // this.router.navigateByUrl('/');
    // console.log(this.loginForm.value);
    this.usuarioService.login(this.loginForm.value).subscribe(
      (resp) => {
        this.router.navigateByUrl('/');
        this.sesionService.time = this.sesionService.getSegundos;
        this.sesionService.ocultar = true;
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

  validarEmail() {
    this.usuarioService.verificarEmail(this.recoveryform.value).subscribe(
      (resp: any) => {
        this.msg = resp.msg;
        this.emailVerificado = resp.usuario.email;
        this.codigoVerificado = resp.usuario.codigo || '';
        this.codigoPaisVerificado = resp.usuario.cod_pais || '';
        const celularResp = resp.usuario.celular;
        this.celularVerificado =
          celularResp.substr(0, 3) +
            '*'.repeat(celularResp.length - 5) +
            celularResp.substr(-2, 2) || '';
        this.okVerificado = resp.ok;
      },
      (err) => {
        this.msg = err.error.msg;
        this.okVerificado = err.error.ok;
      }
    );
  }

  enviarCelular() {
    const { codigo } = this.recoveryform.value;
    if (codigo === this.codigoVerificado) {
      this.usuarioService
        .cambiarPasswordCelular(this.emailVerificado)
        .subscribe((resp: any) => {
          this.msg = null;
          this.msgErrorCelular = null;
          this.emailVerificado = null;
          this.codigoVerificado = null;
          this.codigoPaisVerificado = null;
          this.celularVerificado = null;
          this.okVerificado = null;

          this.recoveryform.controls['recoveryEmail'].setValue('');
          this.recoveryform.controls['codigo'].setValue('');

          Swal.fire({
            icon: 'info',
            title: resp.msg,
            text: 'Revise su Whatsapp para ver la nueva contraseña',
            showConfirmButton: false,
            footer: '<a class="btn btn-primary" href="/login">Ir al login?</a>',
          });
        });
    } else {
      this.msgErrorCelular = 'El codigo no Coincide';
    }
  }
}