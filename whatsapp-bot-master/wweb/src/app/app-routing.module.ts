import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RecordatorioComponent } from './components/recordatorio/recordatorio.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'recordatorio', component: RecordatorioComponent },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
