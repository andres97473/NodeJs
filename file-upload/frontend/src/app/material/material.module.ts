import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatProgressBarModule, MatButtonModule],
  exports: [MatProgressBarModule, MatButtonModule],
})
export class MaterialModule {}
