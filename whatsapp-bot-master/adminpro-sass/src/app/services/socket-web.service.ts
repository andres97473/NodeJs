import { Injectable, EventEmitter } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root',
})
export class SocketWebService extends Socket {
  public usuario!: Usuario;
  outEven: EventEmitter<any> = new EventEmitter();
  callback: EventEmitter<any> = new EventEmitter();
  callbackSol: EventEmitter<any> = new EventEmitter();

  constructor(private usuarioService: UsuarioService) {
    const email = usuarioService.usuario.email;
    super({
      url: 'http://localhost:3000',
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
