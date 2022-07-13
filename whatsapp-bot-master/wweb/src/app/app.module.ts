import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CsvMessagesComponent } from './components/csv-messages/csv-messages.component';
import { HttpClientModule } from '@angular/common/http';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ClienteComponent } from './components/clientes/cliente/cliente.component';
import { MapboxComponent } from './components/mapbox/mapbox.component';
import { MapComponent } from './components/map/map.component';
import { TableComponent } from './components/table/table.component';
import { CsvFijoComponent } from './components/csv-fijo/csv-fijo.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientesComponent,
    NavbarComponent,
    CsvMessagesComponent,
    ClienteComponent,
    MapboxComponent,
    MapComponent,
    TableComponent,
    CsvFijoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
