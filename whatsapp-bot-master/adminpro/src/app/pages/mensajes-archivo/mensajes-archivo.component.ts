import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';

export interface Celular {
  numero: string;
}

@Component({
  selector: 'app-mensajes-archivo',
  templateUrl: './mensajes-archivo.component.html',
  styleUrls: ['./mensajes-archivo.component.css'],
})
export class MensajesArchivoComponent {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  celulares: Celular[] = [];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.celulares.push({ numero: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(celular: Celular): void {
    const index = this.celulares.indexOf(celular);

    if (index >= 0) {
      this.celulares.splice(index, 1);
    }
  }

  verCelulares() {
    console.log(this.celulares);
  }
}
