import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

Mapboxgl.accessToken =
  'pk.eyJ1IjoiYW5kcmVzOTc0NzMiLCJhIjoiY2wzZW02eGp4MDB3NDNpbno5Zmo1Y3hqZCJ9.tw-hpdNX_j1MxFhGqjwGGw';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
