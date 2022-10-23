import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SolicitudService } from '../../services/solicitud.service';
import { UsuarioService } from '../../services/usuario.service';
import { Solicitud } from '../../models/solicitud.model';
import { ModalImagenService } from '../../services/modal-imagen.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { MensajesService } from '../../services/mensajes.service';
import { DOCUMENT } from '@angular/common';
import { SocketWebService } from '../../services/socket-web.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css'],
})
export class SolicitudesComponent implements OnInit, OnDestroy {
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
    this.cargarSolicitudesID();

    // recargar imagen al actualizar

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(200))
      .subscribe((img) => {
        this.cargarSolicitudesID();
      });
  }

  cargarSolicitudesID() {
    this.solicitudService
      .getSolicitudID(this.usuarioService.usuario.getToken || '')
      .subscribe((resp: any) => {
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

  EnviarSoportePago(solicitud: Solicitud) {
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
            const nUrl = `${this.base_url}/upload/solicitudes/${sol.soporte}`;

            this.cargarSolicitudesID();

            // construir mensaje de notificacion a los admins
            const notificacion = `Soporte enviado\n${nUrl}\nusuario: ${this.usuarioService.usuario.email}`;

            this.mensajesService
              .sendMessageAdmin(notificacion)
              .subscribe((resp) => {
                // console.log(resp);
              });

            this.socketWebService.emitEvent({
              usuario: solicitud.usuario,
              nombre: solicitud.nombre,
              descripcion: solicitud.descripcion,
              valor: solicitud.valor,
              estado: 'ENVIADA',
              icono: 'mdi mdi-file-image',
              color: 'btn-primary',
              update_at: solicitud.created_at,
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

  cancelarSolicitud(solicitud: Solicitud) {
    Swal.fire({
      title: 'Cancelar Solicitud',
      text: `Esta seguro que desea Cancelar la solicitud para el siguiente plan? : ${solicitud.nombre}`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Cancelar Solicitud ',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudService
          .cancelarSolicitud(solicitud)
          .subscribe((resp: any) => {
            this.cargarSolicitudesID();
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: resp.msg,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  }
}
