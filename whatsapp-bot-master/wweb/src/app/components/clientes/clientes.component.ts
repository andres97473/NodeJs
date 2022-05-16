import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { GetClientesI, ClienteI } from '../../interface/cliente.interface';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit, AfterViewInit {
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
        Swal.fire('Eliminado!', 'El cliente se elimino con exito.', 'success');
      }
    });
  }
}
