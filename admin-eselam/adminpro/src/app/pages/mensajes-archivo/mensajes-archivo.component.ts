import { Component, ViewChild, OnInit } from '@angular/core';
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
import { PaisI } from '../../interface/pais.interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-mensajes-archivo',
  templateUrl: './mensajes-archivo.component.html',
  styleUrls: ['./mensajes-archivo.component.scss'],
})
export class MensajesArchivoComponent implements OnInit {
  public usuario: Usuario;
  public archivoForm!: FormGroup;
  public formSubmitted = false;
  public errorMessage = '';
  public enviados = 0;
  public fechaEnvio?: Date;
  public paises: PaisI[] = [];
  public codPais!: string;

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
  public extension = '';
  public maxMegas = 15;
  public message: any;
  public enviado = false;
  public enviando = false;
  private _value: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    if (!isNaN(value) && value <= 100) {
      this._value = value;
    }
  }

  constructor(
    private fb: FormBuilder,
    private mensajesService: MensajesService,
    private usuarioService: UsuarioService
  ) {
    this.usuario = usuarioService.usuario;
    this.iniciarFormulario();
  }

  ngOnInit(): void {
    this.codPais = this.usuario.cod_pais || '';
    this.usuarioService.getPaises().subscribe((resp) => {
      this.paises = resp.paises;
    });
  }

  iniciarFormulario() {
    this.archivoForm = this.fb.group({
      token: [this.usuario.uid, [Validators.required]],
      mensaje: [
        localStorage.getItem('smsarchivo') || '',
        [Validators.required],
      ],
      cod_pais: [this.usuario.cod_pais || ''],
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

  validarNumeroCel(cel: string) {
    const regex = new RegExp(/[A-Z.;: ]/, 'g');
    return cel.toUpperCase().trim().replace(regex, '');
  }

  // leer archivo
  add(event: MatChipInputEvent): void {
    const value = this.validarNumeroCel(event.value || '');

    // Add our fruit
    if (value.length >= 7) {
      this.celulares.push({ numero: value });
      this.message = null;
      this.enviado = false;
      this.value = 0;
    }

    // Clear the input value
    event.chipInput!.clear();

    this.stringCelulares();
  }

  remove(celular: Celular): void {
    const index = this.celulares.indexOf(celular);

    if (index >= 0) {
      this.celulares.splice(index, 1);
      this.value = 0;
      this.message = null;
      this.enviado = false;
    }
    this.stringCelulares();
  }

  importarCelulares() {
    const celulares = this.dataSource.data;
    this.message = null;
    this.enviado = false;
    this.value = 0;

    if (celulares.length > 0) {
      for (const iterator of celulares) {
        if (iterator.celular) {
          const nCelular = this.validarNumeroCel(
            String(iterator.celular) || ''
          );
          if (nCelular.length >= 7) {
            this.celulares.push({ numero: nCelular });
          }
        } else if (iterator.celulares) {
          const nCelulares = this.validarNumeroCel(
            String(iterator.celulares) || ''
          );
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
    let { token, mensaje, cod_pais, vence, disponibles, imagen } =
      this.archivoForm.value;
    let stringCel = '';
    for (const cel of this.celulares) {
      stringCel = stringCel + cel.numero + ',';
    }

    const exportCel = stringCel.substring(0, stringCel.length - 1);

    this.archivoForm.setValue({
      token,
      cod_pais,
      celulares: exportCel,
      vence,
      disponibles,
      imagen,
      mensaje,
    });
  }

  calcSize(size: number): string {
    let kb = size / 1024;
    let resultado = '';

    if (kb <= 1000) {
      return (resultado = kb.toFixed(2) + ' KB');
    } else {
      let mb = kb / 1024;
      return (resultado = mb.toFixed(2) + ' MB');
    }
  }

  cambiarArchivo(event: any): any {
    let file = event.target.files[0];

    if (file) {
      if (file.size / 1024 / 1024 > this.maxMegas) {
        const nFile: any = document.getElementById('uploadFile');
        if (nFile.value) {
          nFile.value = '';
          this.archivoSubir = undefined;
          Swal.fire(`El arhivo pesa mas de ${this.maxMegas} Megabytes`);

          return;
        }
      }

      this.value = 0;
      this.message = null;
      this.enviado = false;

      this.archivoSubir = file;

      let { token, mensaje, cod_pais, celulares, vence, disponibles } =
        this.archivoForm.value;

      this.archivoForm.setValue({
        token,
        cod_pais,
        celulares,
        vence,
        disponibles,
        imagen: this.archivoSubir,
        mensaje,
      });

      if (this.archivoSubir) {
        const nExt = this.archivoSubir.name.split('.');
        const extIcono = nExt[nExt.length - 1];
        if (
          extIcono === 'png' ||
          extIcono === 'jpg' ||
          extIcono === 'jpeg' ||
          extIcono === 'jpe'
        ) {
          this.extension = 'fa fa-file-image-o text-success';
        } else if (extIcono === 'pdf') {
          this.extension = 'fa fa-file-pdf-o text-danger';
        } else if (
          extIcono === 'xlsx' ||
          extIcono === 'xls' ||
          extIcono === 'csv'
        ) {
          this.extension = 'fa fa-file-excel-o text-success';
        } else if (extIcono === 'docx' || extIcono === 'doc') {
          this.extension = 'fa fa-file-word-o text-info';
        } else {
          this.extension = 'fa fa-file';
        }
      }
    }
  }

  limpiarCelulares() {
    this.celulares = [];
    this.message = null;
    this.enviado = false;
    this.value = 0;
    let { token, mensaje, cod_pais, vence, disponibles, imagen } =
      this.archivoForm.value;

    this.archivoForm.setValue({
      token,
      mensaje,
      cod_pais,
      celulares: this.celulares,
      vence,
      disponibles,
      imagen,
    });
  }

  // enviar mensaje
  sendMessageImg() {
    this.enviado = true;
    this.enviando = true;
    this.message = null;
    this.value = 0;
    this.errorMessage = '';
    let { token, mensaje, cod_pais, celulares, vence, imagen } =
      this.archivoForm.value;
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
      this.mensajesService
        .sendMessageImg(formData)
        .pipe()
        .subscribe(
          (resp: any) => {
            this.message = null;

            if (resp['loaded'] && resp['total']) {
              this.value = Math.round((resp['loaded'] / resp['total']) * 100);
            }

            if (resp['body']) {
              this.message = resp['body'].msg;
            }

            if (this.message) {
              this.enviando = false;

              this.enviados = resp['body'].enviados;
              this.fechaEnvio = new Date();
              this.usuarioService.usuario.disponibles =
                resp['body'].disponibles;
              this.archivoForm.setValue({
                token,
                mensaje,
                cod_pais,
                celulares,
                vence,
                imagen,
                disponibles: resp['body'].disponibles,
              });
            }
          },
          (err) => {
            // console.log(err);
            Swal.fire(`Error`, err.error.msg, 'error');
          },
          () => {}
        );
    }
  }
}
