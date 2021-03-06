import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UsuarioService } from './services/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  constructor(@Inject(DOCUMENT) private document: Document) {
    // console.log(this.document.location.href);
  }
}
