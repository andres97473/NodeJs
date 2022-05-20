import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { ClienteI } from '../../interface/cliente.interface';

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.css'],
})
export class MapboxComponent implements OnInit, AfterViewInit {
  @ViewChild('mapDiv') mapDivElement!: ElementRef;
  @Input() cliente!: ClienteI;

  longitud = 0;
  latitud = 0;

  constructor() {}

  ngOnInit(): void {
    // console.log(this.cliente);
    if (this.cliente) {
      if (this.cliente.longitud && this.cliente.latitud) {
        this.longitud = parseFloat(this.cliente.longitud);
        this.latitud = parseFloat(this.cliente.latitud);
      }
    }
  }
  ngAfterViewInit(): void {
    if (!this.cliente) throw Error('No hay ubicacion para este cliente');

    const map = new mapboxgl.Map({
      // container ID
      // container: 'map',

      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      // center: [-77.5742146, 0.8060998],
      // starting position [lng, lat]
      center: [this.longitud, this.latitud],
      zoom: 14, // starting zoom
    });

    const marker1 = new mapboxgl.Marker()
      .setLngLat([this.longitud, this.latitud])
      .addTo(map);

    const control1 = new mapboxgl.FullscreenControl();
  }
}
