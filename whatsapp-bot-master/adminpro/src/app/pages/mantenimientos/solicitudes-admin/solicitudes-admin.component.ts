import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SolicitudService } from '../../../services/solicitud.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Solicitud } from '../../../models/solicitud.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { environment } from '../../../../environments/environment';
import { MensajesService } from '../../../services/mensajes.service';
import { DOCUMENT } from '@angular/common';
import { SocketWebService } from '../../../services/socket-web.service';

@Component({
  selector: 'app-solicitudes-admin',
  templateUrl: './solicitudes-admin.component.html',
  styleUrls: ['./solicitudes-admin.component.scss'],
})
export class SolicitudesAdminComponent implements OnInit, OnDestroy {
  public solicitudes: Solicitud[] = [];
  public solicitud?: Solicitud;
  private imgSubs?: Subscription;

  base_url = 'http://localhost:3000/api';
  produccion = environment.produccion;

  constructor(
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService,
    private modalImagenService: ModalImagenService,
    private mensajesService: MensajesService,
    private socketWebService: SocketWebService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.getUrl();
  }

  getUrl() {
    if (this.produccion) {
      this.base_url = this.document.location.href.split('3000')[0] + '3000/api';
    }
  }

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
                  this.socketWebService.emitSolicitutAdmin({
                    email: solicitud.usuario.email,
                    usuario: solicitud.usuario._id,
                    vence: nVence,
                    nombre: solicitud.nombre,
                    descripcion: solicitud.descripcion,
                    valor: solicitud.valor,
                    estado: 'APROBADA',
                    icono: 'mdi mdi-calendar-multiple-check',
                    color: 'btn-info',
                    update_at: solicitud.update_at,
                  });
                });
            } else if (solicitud.disponibles) {
              solicitud.disponibles += usuario.disponibles;
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
                  this.socketWebService.emitSolicitutAdmin({
                    email: solicitud.usuario.email,
                    usuario: solicitud.usuario._id,
                    disponibles: solicitud.disponibles,
                    nombre: solicitud.nombre,
                    descripcion: solicitud.descripcion,
                    valor: solicitud.valor,
                    estado: 'APROBADA',
                    icono: 'mdi mdi-briefcase-check',
                    color: 'btn-info',
                    update_at: solicitud.update_at,
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
      title: 'Denegar Solicitud',
      text: `Esta seguro que desea denegar esta solicitud? : ${solicitud.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Denegar Solicitud',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudService
          .cambiarEstadoSolicitud(solicitud, 'NO_APROBADA')
          .subscribe((resp: any) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: resp.msg,
              showConfirmButton: false,
              timer: 1500,
            });
            this.cargarSolicitudes();
            this.socketWebService.emitSolicitutAdmin({
              email: solicitud.usuario.email,
              usuario: solicitud.usuario._id,
              nombre: solicitud.nombre,
              descripcion: solicitud.descripcion,
              valor: solicitud.valor,
              estado: 'NO_APROBADA',
              icono: 'mdi mdi-calendar-remove',
              color: 'btn-danger',
              update_at: solicitud.update_at,
            });
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
