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

@Component({
  selector: 'app-mensajes-envio',
  templateUrl: './mensajes-envio.component.html',
  styleUrls: ['./mensajes-envio.component.css'],
})
export class MensajesEnvioComponent implements OnInit {
  public usuario: Usuario;
  public mensajeForm!: FormGroup;
  public formSubmitted = false;
  public errorMessage = '';
  public enviados = 0;
  public fechaEnvio?: Date;
  public paises: PaisI[] = [];
  public codPais!: string;

  public maximo = 50;

  public message: any;
  public enviado = false;
  public enviando = false;
  private _value: number = 0;

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
    this.mensajeForm = this.fb.group({
      token: [this.usuario.uid, [Validators.required]],
      mensaje: [localStorage.getItem('smsenvio') || '', [Validators.required]],
      cod_pais: [this.usuario.cod_pais || ''],
      celulares: ['', [Validators.required]],
      vence: [this.usuario.vence || ''],
      disponibles: [this.usuario.disponibles || ''],
    });
  }

  guardarEnMemoria() {
    const { mensaje } = this.mensajeForm.value;
    localStorage.setItem('smsenvio', mensaje);
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

  limpiarCelulares() {
    this.celulares = [];
    this.message = null;
    this.enviado = false;
    this.value = 0;
    let { token, mensaje, vence, disponibles, cod_pais } =
      this.mensajeForm.value;

    this.mensajeForm.setValue({
      token,
      mensaje,
      cod_pais,
      celulares: this.celulares,
      vence,
      disponibles,
    });
  }

  stringCelulares() {
    let { token, mensaje, cod_pais, vence, disponibles } =
      this.mensajeForm.value;
    let stringCel = '';
    for (const cel of this.celulares) {
      stringCel = stringCel + cel.numero + ',';
    }

    const exportCel = stringCel.substring(0, stringCel.length - 1);

    this.mensajeForm.setValue({
      token,
      cod_pais,
      celulares: exportCel,
      vence,
      disponibles,
      mensaje,
    });
  }

  // enviar mensaje
  sendMessage() {
    this.enviado = true;
    this.enviando = true;
    this.message = null;
    this.value = 0;
    this.errorMessage = '';

    let { token, mensaje, cod_pais, celulares, vence, disponibles } =
      this.mensajeForm.value;
    const nCelulares: string[] = celulares.split(',');
    if (nCelulares.length < 1) {
      this.errorMessage = '*Debe enviar al menos un mensaje';
    } else if (nCelulares.length > this.maximo) {
      this.errorMessage = `*No puede enviar mas de ${this.maximo} mensajes en esta prueba`;
    } else {
      this.mensajesService
        .sendMessageToken(this.mensajeForm.value)
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
              this.mensajeForm.setValue({
                token,
                mensaje,
                cod_pais,
                celulares,
                vence,
                disponibles: resp['body'].disponibles,
              });
            }
          },
          (err) => {
            // console.log(err);
            Swal.fire(`Error`, err.error.msg, 'error');
          }
        );
    }
  }
}
