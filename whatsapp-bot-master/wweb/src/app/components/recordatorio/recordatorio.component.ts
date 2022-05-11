import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { RecordatorioModel } from '../../models/recordatorio.model';

// material
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recordatorio',
  templateUrl: './recordatorio.component.html',
  styleUrls: ['./recordatorio.component.css'],
})
export class RecordatorioComponent implements OnInit {
  convertedJson!: string;
  recordatorios: RecordatorioModel[] = [];

  id = 1;
  estado = 'PENDIENTE';
  fecha_proceso?: Date;

  constructor() {}

  ngOnInit(): void {}

  fileUpload(event: any) {
    this.recordatorios = [];
    this.estado = '';
    this.fecha_proceso = new Date();
    //console.log(event.target.files);
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
      //console.log(event);
      let binaryData = event.target?.result;
      let workbook = XLSX.read(binaryData, { type: 'binary' });
      workbook.SheetNames.forEach((sheet) => {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

        data.map((resp: any) => {
          // definir variables
          let id = this.id++;
          const estado = this.estado;
          const fecha_proceso = this.fecha_proceso;

          // desestructurar objetos
          const {
            tipo_doc,
            num_doc_usr,
            apellido1,
            apellido2,
            nombre1,
            nombre2,
            celular,
          } = resp;

          this.recordatorios.push({
            id,
            tipo_doc,
            num_doc_usr,
            apellido1,
            apellido2,
            nombre1,
            nombre2,
            celular,
            estado,
            fecha_proceso,
          });
        });
        console.log(this.recordatorios);
        //this.convertedJson = JSON.stringify(data, undefined, 4);
      });
      //console.log(workbook);
    };
  }
}
