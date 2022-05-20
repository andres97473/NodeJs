import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ClienteI } from '../../../interface/cliente.interface';
import { ClientesService } from '../../../services/clientes.service';
import { Router } from '@angular/router';

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
  tiles: Tile[] = [
    { text: 'One', cols: 2, rows: 1, color: 'lightblue' },
    { text: 'Two', cols: 2, rows: 2, color: 'lightgreen' },
    { text: 'Three', cols: 2, rows: 1, color: 'lightpink' },
  ];

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
      _id: '21010',
      num_doc_usr: '70707',
      tipo_doc: 'CC',
      apellido1: 'ape1',
      apellido2: 'ape2',
      nombre1: 'nom1',
      nombre2: 'nom2',
      celular: '31313',
      estado: 'Pendiente',
      latitud: '00000',
      longitud: '11111',
      created_at: '2022-01-01',
      update_at: '2022-01-02',
    });
    // console.log(this.editCliente);
    if (this.editCliente) {
      this.ubicacion = `https://www.google.com/maps/@${this.editCliente.latitud},${this.editCliente.longitud},15z`;
      this.tituloCliente = 'Actualizar Cliente';
      this.isUpdate = true;
      const creado = this.editCliente.created_at;
      // console.log(creado);

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
        this.editCliente.created_at
      );
      this.clienteForm.controls['update_at'].setValue(
        this.editCliente.update_at
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
    if (this.clienteForm.valid) {
      this._clientesService.crearCliente(this.clienteForm.value).subscribe({
        next: (res) => {
          alert('Cliente creado con exito');
        },
        error: () => {
          alert('Error mientras se registraba el cliente');
        },
      });
    }
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
              timer: 1500,
            });
            this.clienteForm.reset();
            this.dialogRef.close('update');
          },
          error: () => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al actualizar Cliente',
              showConfirmButton: false,
              timer: 1500,
            });
          },
        });
    }
  }
}
