import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public formSubmitted = false;

  public registerForm = this.fb.group(
    {
      nombre: ['Andres', Validators.required],
      email: ['test100@gmail.com', [Validators.required, Validators.email]],
      password: ['88888888', Validators.required],
      password2: ['88888888', Validators.required],
      terminos: [, [Validators.required, Validators.requiredTrue]],
    },
    {
      validators: this.passwordsIguales('password', 'password2'),
    }
  );

  constructor(private fb: FormBuilder) {}

  crearUsuario() {
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if (this.registerForm.valid) {
      console.log('posteando formulario');
    } else {
      console.log('Formulario no es corecto...');
    }
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
