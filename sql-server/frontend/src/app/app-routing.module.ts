import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoriaComponent } from './components/historia/historia.component';
import { TableComponent } from './components/table/table.component';

const routes: Routes = [
  { path: '', redirectTo: 'table', pathMatch: 'full' },
  { path: 'historia', component: HistoriaComponent },
  { path: 'table', component: TableComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
