import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// para que funcione el router-outlet importar el modulo de rutas
import { RouterModule } from '@angular/router';

// modulos
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../material/material.module';

import { PipesModule } from '../pipes/pipes.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { MensajesPruebaComponent } from './mensajes-prueba/mensajes-prueba.component';
import { MensajesEnvioComponent } from './mensajes-envio/mensajes-envio.component';
import { MensajesArchivoComponent } from './mensajes-archivo/mensajes-archivo.component';
import { ClientesComponent } from './clientes/clientes.component';
import { EnviadosComponent } from './enviados/enviados.component';
import { ApisComponent } from './apis/apis.component';
import { PlanesComponent } from './planes/planes.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { SolicitudesAdminComponent } from './mantenimientos/solicitudes-admin/solicitudes-admin.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PagesComponent,
    AccountSettingsComponent,
    PerfilComponent,
    UsuariosComponent,
    BusquedaComponent,
    MensajesPruebaComponent,
    MensajesEnvioComponent,
    MensajesArchivoComponent,
    ClientesComponent,
    EnviadosComponent,
    ApisComponent,
    PlanesComponent,
    SolicitudesComponent,
    SolicitudesAdminComponent,
    NotificacionesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    ComponentsModule,
    PipesModule,
    MaterialModule,
  ],
  exports: [DashboardComponent, PagesComponent, AccountSettingsComponent],
})
export class PagesModule {}
