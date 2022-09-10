import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  public menu: any[] = [];

  cargarMenu() {
    const menuStorage = localStorage.getItem('menu');
    if (menuStorage) {
      this.menu = JSON.parse(menuStorage);
    }
  }
  // menu: any[] = [
  //   {
  //     titulo: 'Dashboard',
  //     icono: 'mdi mdi-gauge',
  //     submenu: [
  //       { titulo: 'Main', url: '/' },
  //       { titulo: 'Graficas', url: 'grafica1' },
  //       { titulo: 'ProgressBar', url: 'progress' },
  //       { titulo: 'Promesas', url: 'promesas' },
  //       { titulo: 'Rxjs', url: 'rxjs' },
  //     ],
  //   },
  //   {
  //     titulo: 'Mantenimientos',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { titulo: 'Usuarios', url: 'usuarios' },
  //       { titulo: 'Hospitales', url: 'hospitales' },
  //       { titulo: 'Medicos', url: 'medicos' },
  //     ],
  //   },
  // ];
}
