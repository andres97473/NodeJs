import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoriaComponent } from './components/historia/historia.component';

const routes: Routes = [
  { path: '', redirectTo: 'historia', pathMatch: 'full' },
  { path: 'historia', component: HistoriaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
