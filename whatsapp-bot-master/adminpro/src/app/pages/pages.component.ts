import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';
import { environment } from '../../environments/environment';

declare function customInitFunctions(): any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [],
})
export class PagesComponent implements OnInit {
  public nombre_app = environment.titulo_app;
  constructor(
    private settingsService: SettingsService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    customInitFunctions();
    this.sidebarService.cargarMenu();
  }
}
