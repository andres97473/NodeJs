import { Injectable, EventEmitter, Inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';

let base_url = environment.produccion
  ? document.location.href.split('3000')[0] + '3000'
  : 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class SocketWebService extends Socket {
  public usuario!: Usuario;
  outEven: EventEmitter<any> = new EventEmitter();
  callback: EventEmitter<any> = new EventEmitter();
  callbackSol: EventEmitter<any> = new EventEmitter();

  constructor(
    private usuarioService: UsuarioService,
    @Inject(DOCUMENT) private document: Document
  ) {
    const email = usuarioService.usuario.email;
    super({
      url: base_url,
      options: {
        query: {
          email: email || '',
        },
      },
    });

    this.listenEvent();
    this.listenSolcitudAdmin();
  }

  listenEvent = () => {
    this.ioSocket.on('evento', (res: any) => this.callback.emit(res));
  };

  listenSolcitudAdmin = () => {
    this.ioSocket.on('solicitud:admin', (res: any) =>
      this.callbackSol.emit(res)
    );
  };

  emitEvent = (payload = {}) => {
    this.ioSocket.emit('evento', payload);
  };

  emitSolicitutAdmin = (payload = {}) => {
    this.ioSocket.emit('solicitud:admin', payload);
  };
}
