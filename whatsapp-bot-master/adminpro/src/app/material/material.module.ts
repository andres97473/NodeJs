import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// material
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  exports: [
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
})
export class MaterialModule {}
