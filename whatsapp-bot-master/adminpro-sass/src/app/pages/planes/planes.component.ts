import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { PlanesService } from '../../services/planes.service';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud } from '../../models/solicitud.model';
import { Plan } from '../../interface/plan.interface';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.scss'],
})
export class PlanesComponent implements OnInit {
  planes: Plan[] = [];

  constructor(
    private planesService: PlanesService,
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPlanes();
  }

  cargarPlanes() {
    this.planesService.getPlanes().subscribe((resp: any) => {
      // console.log(resp.planes);
      this.planes = resp.planes;
    });
  }

  solicitarPlan(plan: Plan) {
    let solicitud: Solicitud = {
      usuario: this.usuarioService.usuario.getToken || '',
      nombre: plan.nombre,
      descripcion: plan.descripcion,
      valor: plan.valor,
      tipo: plan.tipo,
    };
    Swal.fire({
      title: 'Esta seguro que desea Solicitar este plan?',
      text: plan.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Realizar Solicitud ',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (plan.tipo === 1) {
          solicitud.disponibles = plan.disponibles;
        } else {
          solicitud.vence = plan.vence;
        }
        this.solicitudService.crearSolicitud(solicitud).subscribe((resp) => {
          // console.log(resp);
          this.router.navigateByUrl('/dashboard/solicitudes');
        });
      }
    });
  }
}
