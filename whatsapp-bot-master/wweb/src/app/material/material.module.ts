import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatCardModule, MatTableModule, MatSortModule],
  exports: [MatCardModule, MatTableModule, MatSortModule],
})
export class MaterialModule {}
