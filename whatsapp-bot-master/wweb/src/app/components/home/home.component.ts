import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GetClientesI, ClienteI } from '../../interface/cliente.interface';
import { ClientesService } from '../../services/clientes.service';

const ELEMENT_DATA: ClienteI[] = [
  {
    _id: '628144f5a356ccf4b4ad33c4',
    num_doc_usr: '2020',
    tipo_doc: 'CC',
    apellido1: 'OJEDA',
    apellido2: 'IBARRA',
    nombre1: 'ANDRES',
    nombre2: 'FELIPE',
    celular: '3166651382',
    estado: 'PENDIENTE',
    created_at: new Date(),
    update_at: new Date(),
  },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'tipo_doc',
    'num_doc_usr',
    'apellido1',
    'apellido2',
    'nombre1',
    'nombre2',
    'celular',
    'estado',
    'created_at',
    'update_at',
  ];
  dataSource!: MatTableDataSource<ClienteI>;

  clientes: ClienteI[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedRow!: ClienteI | null;

  constructor(private _cli: ClientesService) {
    this.getClientes();
  }
  ngOnInit(): void {}

  getClientes() {
    this._cli.getClientes().subscribe((resp) => {
      this.clientes = resp.clientes;
      // console.log(this.clientes);
      this.dataSource = new MatTableDataSource(this.clientes);
    });
  }

  ngAfterViewInit() {
    setTimeout(
      () => (
        (this.dataSource.paginator = this.paginator),
        (this.dataSource.sort = this.sort)
      ),
      100
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectRow(row: any) {
    //console.log(row);
  }

  actualizarCliente(row: any) {
    console.log(row);
  }
}
