import {
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
// cargar excel
import * as XLSX from 'xlsx';
import { RecordatorioModel } from '../../models/recordatorio.model';
// tabla material
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-recordatorio',
  templateUrl: './recordatorio.component.html',
  styleUrls: ['./recordatorio.component.css'],
})
export class RecordatorioComponent {
  // propiedades cargar archivo excel
  recordatorios: RecordatorioModel[] = [];
  id = 1;
  estado = 'PENDIENTE';
  fecha_proceso?: Date;

  // propiedades tabla material
  displayedColumns: string[] = [
    'id',
    'tipo_doc',
    'num_doc_usr',
    'apellido1',
    'apellido2',
    'nombre1',
    'nombre2',
    'celular',
    'estado',
    'fecha_proceso',
  ];
  dataSource!: MatTableDataSource<RecordatorioModel>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  fileUpload(event: any) {
    this.recordatorios = [];
    this.estado = 'PENDIENTE';
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
            estado: this.estado,
            fecha_proceso,
          });
        });
        //console.log(this.recordatorios);
        this.cargarRecordatorios();
      });
      //console.log(workbook);
    };
  }

  cargarRecordatorios() {
    this.dataSource = new MatTableDataSource(this.recordatorios);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
