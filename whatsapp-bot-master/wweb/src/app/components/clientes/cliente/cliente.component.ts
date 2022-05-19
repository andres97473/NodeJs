import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClienteI } from '../../../interface/cliente.interface';

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

  isDisabled = true;

  clienteForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public editCliente: ClienteI
  ) {}

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      _id: ['3031293101'],
      num_doc_usr: '1010',
      tipo_doc: 'CC',
      apellido1: 'OJEDA',
      apellido2: 'IBARRA',
      nombre1: 'ANDRES',
      nombre2: 'FELIPE',
      celular: '3166651382',
      estado: 'PENDIENTE',
      latitud: '0.32343',
      longitud: '-77.4534',
      created_at: '2022-05-18',
      update_at: '2022-05-18',
    });
    // console.log(this.editCliente);
    if (this.editCliente) {
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

  addCliente() {
    this.clienteForm.controls['estado'].setValue('PENDIENTE');
    delete this.clienteForm.value._id;
    delete this.clienteForm.value.latitud;
    delete this.clienteForm.value.longitud;
    delete this.clienteForm.value.created_at;
    delete this.clienteForm.value.update_at;
    console.log(this.clienteForm.value);
  }
}
