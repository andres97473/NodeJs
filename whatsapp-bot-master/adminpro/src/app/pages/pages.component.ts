import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';
import { environment } from '../../environments/environment';
import { UsuarioService } from '../services/usuario.service';
import { SesionService } from '../services/sesion.service';
import { SocketWebService } from '../services/socket-web.service';

declare function customInitFunctions(): any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [],
})
export class PagesComponent implements OnInit, AfterViewInit {
  public nombre_app = environment.titulo_app;
  pocentaje = 100;

  constructor(
    private settingsService: SettingsService,
    private sidebarService: SidebarService,
    private usuarioService: UsuarioService,
    public sesionService: SesionService,
    private socketWebService: SocketWebService
  ) {
    socketWebService.callback.subscribe((resp) => {
      console.log(resp);
    });

    // TODO: notificacion
    socketWebService.callbackSol.subscribe((resp) => {
      console.log(resp);
      if (resp.disponibles) {
        usuarioService.usuario.disponibles = resp.disponibles;
      } else if (resp.vence) {
        usuarioService.usuario.vence = resp.vence;
      }
    });
  }
  ngAfterViewInit(): void {
    this.myTimer();
  }

  ngOnInit() {
    customInitFunctions();
    this.sidebarService.cargarMenu();
  }

  click() {
    // console.log('click');

    this.sesionService.time = this.sesionService.getSegundos;
  }

  myTimer() {
    const interval = setInterval(() => {
      this.sesionService.time = this.sesionService.time - 1;

      if (this.sesionService.time < 1) {
        this.usuarioService.logout();
        clearInterval(interval);
      } else if (this.sesionService.time === 10) {
        // console.log('abrir modal ', this.sesionService.time);
        this.sesionService.ocultar = false;
        this.pocentaje = 100;
      } else if (this.sesionService.time < 10) {
        this.pocentaje = this.pocentaje - 10;
      } else {
        // console.log('tick ', this.sesionService.time);
      }
    }, 1000);
  }
}
