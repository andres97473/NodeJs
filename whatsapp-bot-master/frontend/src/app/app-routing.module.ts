import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendMessageComponent } from './components/send-message/send-message.component';
import { HomeComponent } from './components/home/home.component';
import { CsvMessagesComponent } from './components/csv-messages/csv-messages.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'send', component: SendMessageComponent },
  { path: 'send-csv', component: CsvMessagesComponent },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
