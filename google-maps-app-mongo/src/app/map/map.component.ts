import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BranchService } from '../services/branch.service';
import { Branch, Address } from '../interfaces/branch';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  center: google.maps.LatLngLiteral = {
    lat: 1.2191213825478662,
    lng: -77.28094769909985,
  };

  markerPositions: google.maps.LatLngLiteral[] = [];
  actualMarkerPosition?: google.maps.LatLngLiteral;
  zoom = 16;

  branchesForm!: FormGroup;
  branchSelected?: Branch;
  branches: Branch[] = [];

  constructor(private branchService: BranchService) {}

  ngOnInit(): void {
    this.iniciarFormalioBranch();
  }

  iniciarFormalioBranch() {
    this.branchesForm = new FormGroup({
      maxDistance: new FormControl<number | null>(1000, Validators.required),
      lat: new FormControl<number | null>(this.center.lat, Validators.required),
      lng: new FormControl<number | null>(this.center.lng, Validators.required),
    });
  }

  branchesSubmit(form: FormGroup) {
    if (form.invalid) {
      alert('Error complete los datos');
    } else {
      this.markerPositions = [];
      this.branchService
        .findBranchesLocation(this.branchesForm.value)
        .subscribe((resp: any) => {
          this.branches = resp.branches;
          this.branches.forEach((branch: Branch) => {
            this.markerPositions.push({
              lat: branch.address.location.coordinates[1],
              lng: branch.address.location.coordinates[0],
            });
          });
          console.log(this.branches);
        });
    }
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      const latLng = event.latLng.toJSON();
      this.actualMarkerPosition = latLng;
      // set form
      this.branchesForm.controls['lat'].setValue(latLng.lat);
      this.branchesForm.controls['lng'].setValue(latLng.lng);
    }
  }

  openInfoWindow(marker: MapMarker) {
    if (this.infoWindow != undefined) {
      const position = marker.getPosition()?.toJSON();

      const branch = this.branches.find(
        (b) =>
          b.address.location.coordinates[1] === position?.lat &&
          b.address.location.coordinates[0] === position?.lng
      );

      if (branch) {
        console.log(branch);

        this.branchSelected = branch;

        this.infoWindow.open(marker);
      } else {
        console.log('No se encontró información de la sucursal.');
      }
    }
  }

  getCurrentLocation() {
    if ('geolocation' in navigator) {
      this.markerPositions = [];
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.actualMarkerPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.branchesForm.controls['lat'].setValue(position.coords.latitude);
        this.branchesForm.controls['lng'].setValue(position.coords.longitude);
      });
    }
  }

  centerBranch(branch: Branch) {
    this.center = {
      lat: branch.address.location.coordinates[1],
      lng: branch.address.location.coordinates[0],
    };
  }
}
