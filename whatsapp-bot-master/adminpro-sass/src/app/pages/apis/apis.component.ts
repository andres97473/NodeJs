import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-apis',
  templateUrl: './apis.component.html',
  styleUrls: ['./apis.component.scss'],
})
export class ApisComponent implements OnInit {
  public url = window.location;
  public panelOpenState = false;

  constructor(public usuarioService: UsuarioService) {}

  ngOnInit(): void {
    // console.log(this.url);
  }
}
