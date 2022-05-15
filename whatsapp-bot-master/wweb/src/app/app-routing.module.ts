import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsvMessagesComponent } from './components/csv-messages/csv-messages.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'csvmessage', component: CsvMessagesComponent },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
