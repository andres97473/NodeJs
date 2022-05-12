import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RecordatorioModel } from '../../models/recordatorio.model';
const ELEMENT_DATA: RecordatorioModel[] = [
  {
    id: 1,
    tipo_doc: 'CC',
    num_doc_usr: '1010',
    apellido1: 'OJEDA',
    apellido2: 'IBARRA',
    nombre1: 'ANDRES',
    nombre2: 'FELIPE',
    celular: 3166651382,
    estado: 'PENDIENTE',
    fecha_proceso: new Date(),
  },
  {
    id: 2,
    tipo_doc: 'CC',
    num_doc_usr: '2020',
    apellido1: 'OJEDA2',
    apellido2: 'IBARRA2',
    nombre1: 'ANDRES2',
    nombre2: 'FELIPE2',
    celular: 3166651382,
    estado: 'PENDIENTE',
    fecha_proceso: new Date(),
  },
  {
    id: 3,
    tipo_doc: 'TI',
    num_doc_usr: '3030',
    apellido1: 'OJEDA3',
    apellido2: 'IBARRA3',
    nombre1: 'ANDRES3',
    nombre2: 'FELIPE3',
    celular: 3166651382,
    estado: 'ENVIADO',
    fecha_proceso: new Date(),
  },
  {
    id: 4,
    tipo_doc: 'CC',
    num_doc_usr: '4040',
    apellido1: 'OJEDA4',
    apellido2: 'IBARRA4',
    nombre1: 'ANDRES4',
    nombre2: 'FELIPE4',
    celular: 3166651382,
    estado: 'PENDIENTE',
    fecha_proceso: new Date(),
  },
  {
    id: 4,
    tipo_doc: 'CC',
    num_doc_usr: '4040',
    apellido1: 'OJEDA4',
    apellido2: 'IBARRA4',
    nombre1: 'ANDRES4',
    nombre2: 'FELIPE4',
    celular: 3166651382,
    estado: 'PENDIENTE',
    fecha_proceso: new Date(),
  },
  {
    id: 4,
    tipo_doc: 'CC',
    num_doc_usr: '4040',
    apellido1: 'OJEDA4',
    apellido2: 'IBARRA4',
    nombre1: 'ANDRES4',
    nombre2: 'FELIPE4',
    celular: 3166651382,
    estado: 'PENDIENTE',
    fecha_proceso: new Date(),
  },
  {
    id: 4,
    tipo_doc: 'CC',
    num_doc_usr: '4040',
    apellido1: 'OJEDA4',
    apellido2: 'IBARRA4',
    nombre1: 'ANDRES4',
    nombre2: 'FELIPE4',
    celular: 3166651382,
    estado: 'PENDIENTE',
    fecha_proceso: new Date(),
  },
  {
    id: 4,
    tipo_doc: 'CC',
    num_doc_usr: '4040',
    apellido1: 'OJEDA4',
    apellido2: 'IBARRA4',
    nombre1: 'ANDRES4',
    nombre2: 'FELIPE4',
    celular: 3166651382,
    estado: 'PENDIENTE',
    fecha_proceso: new Date(),
  },
  {
    id: 4,
    tipo_doc: 'CC',
    num_doc_usr: '4040',
    apellido1: 'OJEDA4',
    apellido2: 'IBARRA4',
    nombre1: 'ANDRES4',
    nombre2: 'FELIPE4',
    celular: 3166651382,
    estado: 'PENDIENTE',
    fecha_proceso: new Date(),
  },
  {
    id: 4,
    tipo_doc: 'CC',
    num_doc_usr: '4040',
    apellido1: 'OJEDA4',
    apellido2: 'IBARRA4',
    nombre1: 'ANDRES4',
    nombre2: 'FELIPE4',
    celular: 3166651382,
    estado: 'PENDIENTE',
    fecha_proceso: new Date(),
  },
  {
    id: 4,
    tipo_doc: 'CC',
    num_doc_usr: '4040',
    apellido1: 'OJEDA4',
    apellido2: 'IBARRA4',
    nombre1: 'ANDRES4',
    nombre2: 'FELIPE4',
    celular: 3166651382,
    estado: 'PENDIENTE',
    fecha_proceso: new Date(),
  },
  {
    id: 4,
    tipo_doc: 'CC',
    num_doc_usr: '4040',
    apellido1: 'OJEDA4',
    apellido2: 'IBARRA4',
    nombre1: 'ANDRES4',
    nombre2: 'FELIPE4',
    celular: 3166651382,
    estado: 'PENDIENTE',
    fecha_proceso: new Date(),
  },
  {
    id: 4,
    tipo_doc: 'CC',
    num_doc_usr: '4040',
    apellido1: 'OJEDA4',
    apellido2: 'IBARRA4',
    nombre1: 'ANDRES4',
    nombre2: 'FELIPE4',
    celular: 3166651382,
    estado: 'PENDIENTE',
    fecha_proceso: new Date(),
  },
  {
    id: 4,
    tipo_doc: 'CC',
    num_doc_usr: '4040',
    apellido1: 'OJEDA4',
    apellido2: 'IBARRA4',
    nombre1: 'ANDRES4',
    nombre2: 'FELIPE4',
    celular: 3166651382,
    estado: 'PENDIENTE',
    fecha_proceso: new Date(),
  },
  {
    id: 4,
    tipo_doc: 'CC',
    num_doc_usr: '4040',
    apellido1: 'OJEDA4',
    apellido2: 'IBARRA4',
    nombre1: 'ANDRES4',
    nombre2: 'FELIPE4',
    celular: 3166651382,
    estado: 'PENDIENTE',
    fecha_proceso: new Date(),
  },
  {
    id: 4,
    tipo_doc: 'CC',
    num_doc_usr: '4040',
    apellido1: 'OJEDA4',
    apellido2: 'IBARRA4',
    nombre1: 'ANDRES4',
    nombre2: 'FELIPE4',
    celular: 3166651382,
    estado: 'PENDIENTE',
    fecha_proceso: new Date(),
  },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
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
  dataSource: MatTableDataSource<RecordatorioModel>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }

  ngAfterViewInit() {
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
