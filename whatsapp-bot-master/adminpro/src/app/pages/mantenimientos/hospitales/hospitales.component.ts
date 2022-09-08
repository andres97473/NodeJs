import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [],
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando = true;
  public imgSubs!: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.cargarHospitales();

    // suscribirse a la emicion de la nueva imagen
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => this.cargarHospitales());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe((hospitales) => {
      this.cargando = false;
      this.hospitales = hospitales;
    });
  }

  guardarCambios(hospital: Hospital) {
    if (hospital._id) {
      this.hospitalService
        .actualizarHospital(hospital._id, hospital.nombre)
        .subscribe(
          (resp) => {
            console.log(resp);
            Swal.fire('Actualizado', hospital.nombre, 'success');
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  eliminarHospital(hospital: Hospital) {
    if (hospital._id) {
      this.hospitalService.borrarHospital(hospital._id).subscribe(
        (resp) => {
          // console.log(resp);
          this.cargarHospitales();
          Swal.fire('Eliminado', hospital.nombre, 'success');
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputLabel: 'Nombre del hospital',
      showCancelButton: true,
    });

    if (value) {
      if (value.trim().length > 0) {
        this.hospitalService.crearHospital(value).subscribe((resp: any) => {
          this.hospitales.push(resp.hospital);
        });
      }
    }
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal(
      'hospitales',
      hospital._id || '',
      hospital.img
    );
  }

  buscarHospitales(termino: string) {
    if (termino.length === 0) {
      return this.cargarHospitales();
    } else {
      return this.busquedasService
        .buscar('hospitales', termino)
        .subscribe((resultados) => {
          this.hospitales = resultados;
        });
    }
  }
}
