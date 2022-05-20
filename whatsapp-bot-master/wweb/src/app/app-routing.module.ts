import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';
import { CsvMessagesComponent } from './components/csv-messages/csv-messages.component';
import { MapboxComponent } from './components/mapbox/mapbox.component';

const routes: Routes = [
  { path: 'clientes', component: ClientesComponent },
  { path: 'csvmessage', component: CsvMessagesComponent },
  { path: 'maps', component: MapboxComponent },
  { path: '**', redirectTo: '/clientes' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
