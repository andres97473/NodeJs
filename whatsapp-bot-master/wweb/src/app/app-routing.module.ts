import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';
import { CsvMessagesComponent } from './components/csv-messages/csv-messages.component';
import { MapComponent } from './components/map/map.component';
import { TableComponent } from './components/table/table.component';
import { CsvFijoComponent } from './components/csv-fijo/csv-fijo.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    component: DashboardComponent,
    children: [
      { path: 'clientes', component: ClientesComponent },
      { path: '', redirectTo: 'clientes', pathMatch: 'full' },
      { path: 'csvmessage', component: CsvMessagesComponent },
      { path: 'csvfijo', component: CsvFijoComponent },
      { path: 'map', component: MapComponent },
      { path: 'table', component: TableComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
