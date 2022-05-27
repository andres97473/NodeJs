import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SockedWebService extends Socket {
  constructor() {
    super({
      url: '',
    });
  }
}
