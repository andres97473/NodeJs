import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ClienteI } from '../../../interface/cliente.interface';
import { ClientesService } from '../../../services/clientes.service';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
  tituloCliente = 'Agregar Cliente';
  isUpdate = false;
  ubicacion = '';

  clienteForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClienteComponent>,
    private _clientesService: ClientesService,
    @Inject(MAT_DIALOG_DATA) public editCliente: ClienteI
  ) {}

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      _id: '',
      num_doc_usr: '',
      tipo_doc: '',
      apellido1: '',
      apellido2: '',
      nombre1: '',
      nombre2: '',
      celular: '',
      estado: '',
      latitud: '',
      longitud: '',
      created_at: '',
      update_at: '',
    });

    if (this.editCliente) {
      //console.log(this.convertirFecha('2022-05-20T23:53:54.018Z'));

      this.ubicacion = `https://maps.google.com/?q=${this.editCliente.latitud},${this.editCliente.longitud}`;
      this.tituloCliente = 'Actualizar Cliente';
      this.isUpdate = true;
      // const creado = moment
      //   .utc(this.editCliente.created_at)
      //   .format('DD-MM-YYYY hh:mm a');
      // const actualizado = moment
      //   .utc(this.editCliente.update_at)
      //   .format('DD-MM-YYYY hh:mm a');

      this.clienteForm.controls['_id'].setValue(this.editCliente._id);
      this.clienteForm.controls['num_doc_usr'].setValue(
        this.editCliente.num_doc_usr
      );
      this.clienteForm.controls['tipo_doc'].setValue(this.editCliente.tipo_doc);
      this.clienteForm.controls['apellido1'].setValue(
        this.editCliente.apellido1
      );
      this.clienteForm.controls['apellido2'].setValue(
        this.editCliente.apellido2
      );
      this.clienteForm.controls['nombre1'].setValue(this.editCliente.nombre1);
      this.clienteForm.controls['nombre2'].setValue(this.editCliente.nombre2);
      this.clienteForm.controls['celular'].setValue(this.editCliente.celular);
      this.clienteForm.controls['estado'].setValue(this.editCliente.estado);
      this.clienteForm.controls['latitud'].setValue(this.editCliente.latitud);
      this.clienteForm.controls['longitud'].setValue(this.editCliente.longitud);
      this.clienteForm.controls['created_at'].setValue(
        this.convertirFecha(this.editCliente.created_at + '')
      );
      this.clienteForm.controls['update_at'].setValue(
        this.convertirFecha(this.editCliente.update_at + '')
      );
    }
  }

  guardar() {
    this.clienteForm.controls['estado'].setValue('PENDIENTE');
    delete this.clienteForm.value._id;
    delete this.clienteForm.value.latitud;
    delete this.clienteForm.value.longitud;
    delete this.clienteForm.value.created_at;
    delete this.clienteForm.value.update_at;

    if (!this.editCliente) {
      // console.log(this.clienteForm.value);
      this.addCliente();
    } else {
      this.updateCliente();
    }
  }

  addCliente() {
    this._clientesService.crearCliente(this.clienteForm.value).subscribe({
      next: (resp) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Cliente Creado con exito',
          showConfirmButton: false,
          timer: 2000,
        });
        this.clienteForm.reset();
        this.dialogRef.close('create');
      },
      error: (err) => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al crear Cliente, ' + err.error.msg,
          showConfirmButton: false,
          timer: 2000,
        });
        // console.log(err.error.msg);
      },
    });
  }

  updateCliente() {
    if (this.editCliente._id) {
      this._clientesService
        .actualizarCliente(this.clienteForm.value, this.editCliente._id)
        .subscribe({
          next: (resp) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Cliente Actualizado con exito',
              showConfirmButton: false,
              timer: 2000,
            });
            this.clienteForm.reset();
            this.dialogRef.close('update');
          },
          error: (err) => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al actualizar Cliente, ' + err.error.msg,
              showConfirmButton: false,
              timer: 2000,
            });
            // console.log(err.error.msg);
          },
        });
    }
  }

  convertirFecha(date: string) {
    var time = new Date(date);
    const dateFormat = time.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      hour12: true,
      minute: 'numeric',
    });
    return dateFormat;
  }
}
