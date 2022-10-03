import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SolicitudService } from '../../../services/solicitud.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Solicitud } from '../../../models/solicitud.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { environment } from '../../../../environments/environment';
import { MensajesService } from '../../../services/mensajes.service';

@Component({
  selector: 'app-solicitudes-admin',
  templateUrl: './solicitudes-admin.component.html',
  styleUrls: ['./solicitudes-admin.component.css'],
})
export class SolicitudesAdminComponent implements OnInit, OnDestroy {
  public solicitudes: Solicitud[] = [];
  public solicitud?: Solicitud;
  private imgSubs?: Subscription;
  private base_url = environment.base_url;

  constructor(
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService,
    private modalImagenService: ModalImagenService,
    private mensajesService: MensajesService
  ) {}
  ngOnDestroy(): void {
    this.imgSubs?.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarSolicitudes();

    // recargar imagen al actualizar

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(200))
      .subscribe((img) => {
        this.cargarSolicitudes();
      });
  }

  cargarSolicitudes() {
    this.solicitudService.getSolicitudes().subscribe((resp: any) => {
      this.solicitudes = resp.solicitudes;
      console.log(this.solicitudes);
    });
  }

  abrirModal(solicitud: Solicitud) {
    this.modalImagenService.abrirModal(
      'solicitudes',
      solicitud._id || '',
      solicitud.soporte_pago
    );
  }

  aprobarSolicitud(
    solicitud: Solicitud,
    usuario: {
      disponibles: number;
      email: string;
      nombre: string;
      vence: string;
      _id: string;
    }
  ) {
    Swal.fire({
      title: 'Aprobar Solicitud',
      text: `Esta seguro que desea aprobar la solicitud? : ${solicitud.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Aprobar solicitud',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudService
          .cambiarEstadoSolicitud(solicitud, 'APROBADA')
          .subscribe((sol: any) => {
            console.log(sol);
            if (solicitud.vence) {
              // comparar fechas de vencimiento
              const usuarioVence = new Date(usuario.vence);
              const hoy = new Date();

              let resta = usuarioVence.getTime() - hoy.getTime();

              console.log(resta);

              let nVence = '';

              if (resta < 0) {
                let e = new Date();
                e.setMonth(e.getMonth() + solicitud.vence);

                nVence = String(
                  e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate()
                );
              } else {
                let e = new Date(usuario.vence);
                e.setMonth(e.getMonth() + solicitud.vence);

                nVence = String(
                  e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate()
                );
              }

              this.usuarioService
                .actualizarMensajesFecha(solicitud.usuario.email, nVence)
                .subscribe((resp: any) => {
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: resp.msg,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                });
            } else if (solicitud.disponibles) {
              this.usuarioService
                .actualizarMensajesDisponibles(
                  solicitud.usuario.email,
                  solicitud.disponibles
                )
                .subscribe((resp: any) => {
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: resp.msg,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                });
            }
            this.cargarSolicitudes();
          });
      }
    });
  }

  denegarSolicitud(solicitud: Solicitud) {
    Swal.fire({
      title: 'Enviar Soporte de Pago',
      text: `Esta seguro que desea enviar el soporte de pago para el siguiente plan? : ${solicitud.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Enviar Soporte de pago',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudService
          .enviarSoportePago(solicitud)
          .subscribe((sol: any) => {
            console.log(sol);
          });
      }
    });
  }

  verSoporte(solicitud: Solicitud) {
    const nUrl = `${this.base_url}/upload/solicitudes/${solicitud.soporte_pago}`;
    // console.log(nUrl);
    const win = window.open(nUrl, '_blank');

    if (win) {
      // Cambiar el foco al nuevo tab (punto opcional)
      win.focus();
    }
  }
}
