import { Component, OnInit } from '@angular/core';
import { PlanesService } from '../../services/planes.service';
import { Plan } from '../../interface/plan.interface';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css'],
})
export class PlanesComponent implements OnInit {
  planes: Plan[] = [];

  constructor(private planesService: PlanesService) {}

  ngOnInit(): void {
    this.cargarPlanes();
  }

  cargarPlanes() {
    this.planesService.getPlanes().subscribe((resp: any) => {
      console.log(resp.planes);
      this.planes = resp.planes;
    });
  }

  solicitarPlan(plan: Plan) {
    console.log(plan);
  }
}
