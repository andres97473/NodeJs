import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BusquedasService } from '../../services/busquedas.service';

import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [],
})
export class BusquedaComponent implements OnInit {
  public usuarios: Usuario[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ termino }) => {
      // console.log(termino);
      this.busquedaGlobal(termino);
    });
  }

  busquedaGlobal(termino: string) {
    this.busquedasService.busquedaGlobal(termino).subscribe((resp: any) => {
      // console.log(resp);
      this.usuarios = resp.usuarios;
    });
  }

  // abrir usuario
  // abrirMedico(medico: Medico) {
  //   // console.log(medico);
  //   this.router.navigateByUrl(`/dashboard/medico/${medico._id}`);
  // }
}
