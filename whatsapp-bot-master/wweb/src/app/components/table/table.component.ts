import {
  AfterViewInit,
  Component,
  ViewChild,
  OnInit,
  Inject,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatRow, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { ClienteComponent } from '../clientes/cliente/cliente.component';
import { GetClientesI, ClienteI } from '../../interface/cliente.interface';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
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
    'acciones',
  ];
  dataSource!: MatTableDataSource<ClienteI>;

  clientes: ClienteI[] = [];
  clientesFiltro: ClienteI[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedRow!: ClienteI | null;

  constructor(private _cli: ClientesService, private dialog: MatDialog) {
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

  iniciarPaginator() {
    this.paginator._intl.itemsPerPageLabel = 'Items por Pagina';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.firstPageLabel = 'Primera pagina';
    this.paginator._intl.lastPageLabel = 'Ultima pagina';
    // cambiar etiqueta de range label
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      // console.log(length);

      if (end >= length) {
        return `${pageSize} Mostrando ${start} - ${length} de ${length}`;
      } else {
        return `${pageSize} Mostrando ${start} - ${end} de ${length}`;
      }
    };
  }

  ngAfterViewInit() {
    setTimeout(
      () => (
        (this.dataSource.paginator = this.paginator),
        (this.dataSource.sort = this.sort),
        this.iniciarPaginator()
      ),
      300
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectRow(row: ClienteI) {
    console.log(row);
  }

  borrarCliente(row: any) {
    // console.log(row);
    Swal.fire({
      title: `Desea Eliminar al Cliente, ${row.apellido1} ${row.apellido2} ${row.nombre1} ${row.nombre2} ?`,
      text: `id: ${row._id}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this._cli.borrarCliente(row._id).subscribe((resp) => {
          Swal.fire(
            'Eliminado!',
            'El cliente se elimino con exito.',
            'success'
          );
        });
        const nClientes = this.clientes.filter((item) => item._id !== row._id);
        this.clientes = nClientes;
        this.dataSource.data = this.clientes;
      }
    });
  }

  crearCliente() {
    this.dialog
      .open(ClienteComponent, {
        width: '70%',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'create') {
          this.getClientes();
        }
      });
  }

  editarCliente(row: ClienteI) {
    this.dialog
      .open(ClienteComponent, {
        width: '70%',
        disableClose: true,

        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getClientes();
        }
      });
  }
}
