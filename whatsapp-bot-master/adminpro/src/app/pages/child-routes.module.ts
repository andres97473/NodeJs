import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminGuard } from '../guards/admin.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PerfilComponent } from './perfil/perfil.component';

// Mensajes
import { MensajesPruebaComponent } from './mensajes-prueba/mensajes-prueba.component';
import { MensajesEnvioComponent } from './mensajes-envio/mensajes-envio.component';
import { MensajesArchivoComponent } from './mensajes-archivo/mensajes-archivo.component';
import { ClientesComponent } from './clientes/clientes.component';
import { EnviadosComponent } from './enviados/enviados.component';

// Mantenimientos
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';

const childRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: { titulo: 'Inicio' },
  },
  {
    path: 'account-settings',
    component: AccountSettingsComponent,
    data: { titulo: 'Ajustes' },
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    data: { titulo: 'Perfil de Usuario' },
  },
  {
    path: 'mensajes-prueba',
    component: MensajesPruebaComponent,
    data: { titulo: 'Prueba de envio a mi Propio Whatsapp' },
  },
  {
    path: 'mensajes-envio',
    component: MensajesEnvioComponent,
    data: { titulo: 'Envio de mensajes a Whatsapp' },
  },
  {
    path: 'mensajes-archivo',
    component: MensajesArchivoComponent,
    data: { titulo: 'Envio de archivos a Whatsapp' },
  },
  {
    path: 'clientes',
    component: ClientesComponent,
    data: { titulo: 'Clientes registrados en la aplicacion' },
  },
  {
    path: 'enviados',
    component: EnviadosComponent,
    data: { titulo: 'Mensajes envidos a Whatsapp' },
  },

  // Mantenimientos

  {
    path: 'hospitales',
    component: HospitalesComponent,
    data: { titulo: 'Mantenimiento de Hospitales' },
  },
  {
    path: 'medicos',
    component: MedicosComponent,
    data: { titulo: 'Mantenimiento de Medicos' },
  },
  {
    path: 'medico/:id',
    component: MedicoComponent,
    data: { titulo: 'Mantenimiento de Medicos' },
  },
  // Rutas de Admin
  {
    path: 'usuarios',
    canActivate: [AdminGuard],
    component: UsuariosComponent,
    data: { titulo: 'Mantenimiento de Usuarios' },
  },
  {
    path: 'buscar/:termino',
    canActivate: [AdminGuard],
    component: BusquedaComponent,
    data: { titulo: 'Busquedas' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
