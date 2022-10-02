import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SolicitudService } from '../../services/solicitud.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Solicitud } from '../../models/solicitud.model';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css'],
})
export class SolicitudesComponent implements OnInit, OnDestroy {
  public solicitudes: Solicitud[] = [];
  private imgSubs?: Subscription;

  constructor(
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService,
    private modalImagenService: ModalImagenService
  ) {}
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

  cancelarSolicitud(solicitud: Solicitud) {
    console.log(solicitud);
  }
}
