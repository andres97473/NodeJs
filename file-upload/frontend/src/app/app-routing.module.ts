import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadComponent } from './components/download/download.component';
import { UploadComponent } from './components/upload/upload.component';

const routes: Routes = [
  { path: 'download', component: DownloadComponent },
  { path: 'upload', component: UploadComponent },
  { path: '', redirectTo: '/download', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
