import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';
import { environment } from '../../environments/environment';
import { UsuarioService } from '../services/usuario.service';

declare function customInitFunctions(): any;
const segundos = 60 * 10;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [],
})
export class PagesComponent implements OnInit, AfterViewInit {
  public nombre_app = environment.titulo_app;
  time = segundos;

  constructor(
    private settingsService: SettingsService,
    private sidebarService: SidebarService,
    private usuarioService: UsuarioService
  ) {}
  ngAfterViewInit(): void {
    this.myTimer();
  }

  ngOnInit() {
    customInitFunctions();
    this.sidebarService.cargarMenu();
  }

  click() {
    this.time = segundos;
  }

  myTimer() {
    const interval = setInterval(() => {
      this.time = this.time - 1;
      if (this.time < 1) {
        this.usuarioService.logout();
        clearInterval(interval);
      }
    }, 1000);
  }
}
