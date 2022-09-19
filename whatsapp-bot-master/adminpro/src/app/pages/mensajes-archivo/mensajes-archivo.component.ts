import { Component, ViewChild } from '@angular/core';
// forms
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

//chips
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
// table
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
// xlsx js
import * as XLSX from 'xlsx';
// interfaces
import { Columna, Celular } from '../../interface/mensajes.interface';
// models
import { Usuario } from '../../models/usuario.model';
// services
import { MensajesService } from '../../services/mensajes.service';
import { UsuarioService } from '../../services/usuario.service';
// externos
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mensajes-archivo',
  templateUrl: './mensajes-archivo.component.html',
  styleUrls: ['./mensajes-archivo.component.css'],
})
export class MensajesArchivoComponent {
  public usuario: Usuario;
  public archivoForm!: FormGroup;
  public formSubmitted = false;
  public errorMessage = '';

  public maximo = 50;

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

  // archivo
  public archivoSubir?: File;
  public archivoTemp: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private mensajesService: MensajesService,
    private usuarioService: UsuarioService
  ) {
    this.usuario = usuarioService.usuario;
    this.iniciarFormulario();
  }

  iniciarFormulario() {
    this.archivoForm = this.fb.group({
      token: [this.usuario.uid, [Validators.required]],
      mensaje: [
        localStorage.getItem('smsarchivo') || '',
        [Validators.required],
      ],
      celulares: ['', [Validators.required]],
      vence: [this.usuario.vence || ''],
      disponibles: [this.usuario.disponibles || ''],
      imagen: [, [Validators.required]],
    });
  }

  guardarEnMemoria() {
    const { mensaje } = this.archivoForm.value;
    localStorage.setItem('smsarchivo', mensaje);
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Mensaje almacenado en Memoria',
      showConfirmButton: false,
      timer: 2000,
    });
  }

  copyToClipBoard() {
    let content: any = document.getElementById('tokentxt');

    content.select();
    document.execCommand('copy');
  }

  // leer archivo
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim().replace(/ /g, '');

    // Add our fruit
    if (value.length >= 7) {
      this.celulares.push({ numero: value });
    }

    // Clear the input value
    event.chipInput!.clear();

    this.stringCelulares();
  }

  remove(celular: Celular): void {
    const index = this.celulares.indexOf(celular);

    if (index >= 0) {
      this.celulares.splice(index, 1);
    }
    this.stringCelulares();
  }

  importarCelulares() {
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
    this.stringCelulares();
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

  stringCelulares() {
    let { token, mensaje, vence, disponibles, imagen } = this.archivoForm.value;
    let stringCel = '';
    for (const cel of this.celulares) {
      stringCel = stringCel + cel.numero + ',';
    }

    const exportCel = stringCel.substring(0, stringCel.length - 1);

    this.archivoForm.setValue({
      token,
      celulares: exportCel,
      vence,
      disponibles,
      imagen,
      mensaje,
    });
  }

  cambiarArchivo(event: any): any {
    const file = event.target.files[0];
    this.archivoSubir = file;

    let { token, mensaje, celulares, vence, disponibles, imagen } =
      this.archivoForm.value;

    this.archivoForm.setValue({
      token,
      celulares,
      vence,
      disponibles,
      imagen: this.archivoSubir,
      mensaje,
    });
  }

  // enviar mensaje
  sendMessageImg() {
    this.errorMessage = '';
    let { token, mensaje, celulares, vence, imagen } = this.archivoForm.value;
    const nCelulares: string[] = celulares.split(',');
    if (nCelulares.length < 1) {
      this.errorMessage = '*Debe enviar al menos un mensaje';
    } else if (nCelulares.length > this.maximo) {
      this.errorMessage = `*No puede enviar mas de ${this.maximo} mensajes en esta prueba`;
    } else {
      const formData = new FormData();
      formData.append('imagen', imagen);
      formData.append('celulares', celulares);
      formData.append('mensaje', mensaje);
      formData.append('token', token);
      this.mensajesService.sendMessageImg(formData).subscribe(
        (resp: any) => {
          this.usuarioService.usuario.disponibles = resp.disponibles;
          this.archivoForm.setValue({
            token,
            mensaje,
            celulares,
            vence,
            imagen,
            disponibles: resp.disponibles,
          });
          Swal.fire(`Envio exitoso`, resp.msg, 'success');
        },
        (err) => {
          // console.log(err);
          Swal.fire(`Error`, err.error.msg, 'error');
        }
      );
    }
  }
}
