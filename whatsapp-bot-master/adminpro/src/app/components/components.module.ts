import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IncrementadorComponent } from './incrementador/incrementador.component';
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component';
import { TablaComponent } from './tabla/tabla.component';
import { MaterialModule } from '../material/material.module';
import { Table2Component } from './table2/table2.component';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  declarations: [
    IncrementadorComponent,
    ModalImagenComponent,
    TablaComponent,
    Table2Component,
    TimerComponent,
  ],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [
    IncrementadorComponent,
    ModalImagenComponent,
    TablaComponent,
    Table2Component,
    TimerComponent,
  ],
})
export class ComponentsModule {}
