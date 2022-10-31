import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SesionService {
  public time: number;
  public ocultar = true;

  constructor() {
    this.time = this.getSegundos;
  }

  get getSegundos(): number {
    return 60 * 5;
  }
}
