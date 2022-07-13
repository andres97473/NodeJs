import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';
import { CsvMessagesComponent } from './components/csv-messages/csv-messages.component';
import { MapComponent } from './components/map/map.component';
import { TableComponent } from './components/table/table.component';
import { CsvFijoComponent } from './components/csv-fijo/csv-fijo.component';

const routes: Routes = [
  { path: 'clientes', component: ClientesComponent },
  { path: 'csvmessage', component: CsvMessagesComponent },
  { path: 'csvfijo', component: CsvFijoComponent },
  { path: 'map', component: MapComponent },
  { path: 'table', component: TableComponent },
  { path: '**', redirectTo: '/clientes' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
