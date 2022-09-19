import { Component, AfterViewInit, ViewChild } from '@angular/core';
//chips
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
// table
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import * as XLSX from 'xlsx';
import { Columna } from '../../interface/columna.interface';

// interfaces
export interface Celular {
  numero: string;
}

@Component({
  selector: 'app-mensajes-archivo',
  templateUrl: './mensajes-archivo.component.html',
  styleUrls: ['./mensajes-archivo.component.css'],
})
export class MensajesArchivoComponent implements AfterViewInit {
  // propiedades
  celulares: Celular[] = [];
  excelData: any;
  titulos: any;
  // chips
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  // tables
  dataSource: any;
  displayedColumns: string[] = [];
  columnas: Columna[] = [];

  excelColumnas: Columna[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {}

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim().replace(/ /g, '');

    // Add our fruit
    if (value.length >= 7) {
      this.celulares.push({ numero: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(celular: Celular): void {
    const index = this.celulares.indexOf(celular);

    if (index >= 0) {
      this.celulares.splice(index, 1);
    }
  }

  verCelulares() {
    const celulares = this.dataSource.data;

    if (celulares.length > 0) {
      for (const iterator of celulares) {
        if (iterator.celular) {
          const nCelular = (String(iterator.celular) || '')
            .trim()
            .replace(/ /g, '');
          if (nCelular.length >= 7) {
            this.celulares.push({ numero: nCelular });
          }
        } else if (iterator.celulares) {
          const nCelulares = (String(iterator.celulares) || '')
            .trim()
            .replace(/ /g, '');
          if (nCelulares.length >= 7) {
            this.celulares.push({ numero: nCelulares });
          }
        }
      }
    }
  }

  readExcel(evento: any) {
    this.displayedColumns = [];
    this.columnas = [];
    this.dataSource = new MatTableDataSource<any>();
    let file = evento.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) => {
      let workBook = XLSX.read(fileReader.result, { type: 'binary' });
      let sheetNames = workBook.SheetNames;

      this.excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      this.titulos = Object.keys(this.excelData[0]);

      for (const iterator of Object.keys(this.excelData[0])) {
        this.columnas.push({ titulo: iterator, name: iterator });
      }

      this.displayedColumns = this.titulos;
      this.dataSource = new MatTableDataSource<any>(this.excelData);

      if (this.displayedColumns.length > 0) {
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }, 100);
      }
      // console.log(this.dataSource);
    };
  }
}
