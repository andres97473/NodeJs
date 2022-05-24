import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapDiv2') mapDivElement!: ElementRef;

  longitud = -77.5742146;
  latitud = 0.8060998;

  // estilos de mapa

  stylesMap = {
    streets: 'mapbox://styles/mapbox/streets-v11',
    outdoors: 'mapbox://styles/mapbox/outdoors-v11',
    light: 'mapbox://styles/mapbox/light-v10',
    dark: 'mapbox://styles/mapbox/dark-v10',
    satellite: 'mapbox://styles/mapbox/satellite-v9',
    satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11',
    navigationDay: 'mapbox://styles/mapbox/navigation-day-v1',
    navigationNight: 'mapbox://styles/mapbox/navigation-night-v1',
  };

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    //if (!this.cliente) throw Error('No hay ubicacion para este cliente');

    const map = new mapboxgl.Map({
      // container ID
      // container: 'map',

      container: this.mapDivElement.nativeElement,
      style: this.stylesMap.streets, // style URL
      // center: [-77.5742146, 0.8060998],
      // starting position [lng, lat]
      center: [this.longitud, this.latitud],
      zoom: 15, // starting zoom
    });

    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());

    const marker1 = new mapboxgl.Marker()
      .setLngLat([this.longitud, this.latitud])
      .addTo(map);
  }
}
