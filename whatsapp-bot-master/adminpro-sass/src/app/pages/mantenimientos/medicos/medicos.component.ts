import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  public cargando = true;
  public medicos: Medico[] = [];
  public imgSubs!: Subscription;
  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.cargarMedicos();

    // suscribirse a la emicion de la nueva imagen
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => this.cargarMedicos());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe((resp) => {
      this.cargando = false;
      // console.log(resp);
      this.medicos = resp;
    });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id || '', medico.img);
  }

  buscarMedicos(termino: string) {
    if (termino.length === 0) {
      return this.cargarMedicos();
    } else {
      return this.busquedasService
        .buscar('medicos', termino)
        .subscribe((resultados) => {
          this.medicos = resultados;
        });
    }
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Borrar Medico?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar medico!',
    }).then((result) => {
      if (result.isConfirmed) {
        if (medico._id) {
          this.medicoService.borrarMedico(medico._id).subscribe((resp) => {
            Swal.fire(
              'Medico Borrado',
              `${medico.nombre} fue eliminado correctamente`,
              'success'
            );
            this.cargarMedicos();
          });
        }
      }
    });
  }
}
