import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { RecordatorioModel, Respuesta } from '../../models/recordatorio.model';
import { MessagesService } from '../../services/messages.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-csv-fijo',
  templateUrl: './csv-fijo.component.html',
  styleUrls: ['./csv-fijo.component.scss'],
})
export class CsvFijoComponent implements OnInit {
  usuario: any;
  // cargar archivo csv
  csvRecords: RecordatorioModel[] = [];
  // csvRecordsFilter: RecordatorioModel[] = [];

  txtArea = localStorage.getItem('msgwhatsapp') || '';

  // cargar archivo xls p xlsx
  recordatorios: RecordatorioModel[] = [];
  id = 1;
  estado = 'PENDIENTE';
  fecha_proceso?: Date;

  // objeto para inicar la respuesta de la api
  respuesta: Respuesta = {
    send: false,
    status: 'no enviado',
  };

  coneccion = true;
  errores = 0;

  // paginacion
  paginacion = 10;
  starIndex = 0;
  endIndex = this.paginacion;
  pageIndex = 0;

  //filtros
  num_doc_usr = '';
  apellido1 = '';
  apellido2 = '';
  sinCoincidencia = false;

  @ViewChild('fileImportInput') fileImportInput: any;

  constructor(private _sms: MessagesService, private router: Router) {}
  ngOnInit(): void {
    this.usuario = this.getUsuarioStorage();
  }

  getUsuarioStorage() {
    const usuario = localStorage.getItem('usuario');

    if (usuario) {
      return JSON.parse(usuario);
    }
    return null;
  }

  fileUpload(event: any) {
    this.recordatorios = [];
    this.estado = 'PENDIENTE';
    this.fecha_proceso = new Date();
    //console.log(event.target.files);
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
      //console.log(event);
      let binaryData = event.target?.result;
      let workbook = XLSX.read(binaryData, { type: 'binary' });
      workbook.SheetNames.forEach((sheet) => {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

        data.map((resp: any) => {
          // definir variables
          let id = this.id++;

          const fecha_proceso = this.fecha_proceso;

          // desestructurar objetos
          const {
            tipo_doc,
            num_doc_usr,
            apellido1,
            apellido2,
            nombre1,
            nombre2,
            celular,
          } = resp;

          this.recordatorios.push({
            id,
            tipo_doc,
            num_doc_usr,
            apellido1,
            apellido2,
            nombre1,
            nombre2,
            celular,
            estado: this.estado,
            fecha_proceso,
          });
        });
        // console.log(this.recordatorios);
        this.csvRecords = this.recordatorios;
        // this.csvRecordsFilter = this.recordatorios;
      });
      //console.log(workbook);
    };
  }

  msgLocalStorage() {
    localStorage.setItem('msgwhatsapp', this.txtArea);
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Mensaje almacenado en Memoria!!',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  getArrayFromNumber(length: any) {
    return new Array(Math.ceil(length / this.paginacion));
  }

  updateIndex(pgIdx: any) {
    this.starIndex = pgIdx * this.paginacion;
    this.endIndex = this.starIndex + this.paginacion;

    this._sms.pageIndex = pgIdx;
    //console.log(this._sms.pageIndex);
  }

  sendMessagesCsv(messages: RecordatorioModel[]) {
    //console.log(messages);
    let celulares: number[] = [];
    this.errores = 0;
    if (this.coneccion) {
      for (const message of messages) {
        const { id, celular } = message;

        celulares.push(Number(celular));
      }
      // console.log(celulares);
      this._sms
        .sendMessageToken(celulares, this.txtArea, this.usuario.uid)
        .subscribe(
          (res: any) => {
            const storageUsuario = localStorage.getItem('usuario');
            if (storageUsuario) {
              let usuario = JSON.parse(storageUsuario);
              usuario.disponibles = res.disponibles;

              // console.log(usuario);
              localStorage.setItem('usuario', JSON.stringify(usuario));
              //console.log(localStorage.getItem('usuario'));
            }
            // console.log(res);

            this.respuesta = res;
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: this.respuesta.status,
              text: `${this.csvRecords.length} Mensajes enviados !!`,
              showConfirmButton: false,
              timer: 3000,
            });
          },
          (err) => {
            // console.log(err);
            this.errores++;
            if (this.errores < 2) {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error al enviar los mensajes !!',
                text: err.error.msg,
                showConfirmButton: false,
                timer: 3000,
              });
            }
            return (this.coneccion = false);
          }
        );
    } else {
      console.log('sin coneccion');
    }
  }

  cambiarEstado(id: number, estado: string) {
    const datos = this.csvRecords;
    datos.map((dato) => {
      if (dato.id == id) {
        dato.estado = estado;
        dato.fecha_proceso = new Date();
      }

      //console.log(dato);
    });
  }

  eliminarItem(obj: RecordatorioModel) {
    // this.csvRecords = this.csvRecordsFilter;

    const index = this.csvRecords.findIndex((records) => records.id === obj.id);

    this.csvRecords.splice(index, 1);

    this.updateIndex(this._sms.pageIndex);
  }

  eliminarLista() {
    Swal.fire({
      title: 'Esta seguro de eliminar la tabla?',
      text: 'Aunque la tabla se elimine el archivo permanecerá igual',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar tabla!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Tabla eliminada!',
          'Si deseas enviar nuevos mensajes debes volver a cargar un archivo',
          'success'
        );
        this.csvRecords = [];
        this.resetFile();
        this.id = 1;
      }
    });
  }

  resetFile() {
    (this.fileImportInput as ElementRef).nativeElement.value = '';
  }

  alert(sends: number) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: `Se enviaron ${sends} mensajes`,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  // removeAccents(str: string) {
  //   return str
  //     .normalize('NFD')
  //     .replace(/[\u0300-\u036f]/g, '')
  //     .replace('á', 'a')
  //     .replace('é', 'e')
  //     .replace('í', 'i')
  //     .replace('ó', 'o')
  //     .replace('ú', 'u')
  //     .replace('´', '')
  //     .toUpperCase();
  // }
}
