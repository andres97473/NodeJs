import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
import { RecordatorioModel, Respuesta } from '../../models/recordatorio.model';
import { MessagesService } from '../../services/messages.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-csv-messages',
  templateUrl: './csv-messages.component.html',
  styleUrls: ['./csv-messages.component.css'],
})
export class CsvMessagesComponent {
  // cargar archivo csv
  csvRecords: RecordatorioModel[] = [];
  csvRecordsFilter: RecordatorioModel[] = [];
  header: boolean = true;
  files: any;
  delimitador = '|';

  // objeto para inicar la respuesta de la api
  respuesta: Respuesta = {
    send: false,
    status: 'no enviado',
  };

  coneccion = true;
  errores = 0;
  estado = 'PENDIENTE';

  // paginacion
  paginacion = 10;
  starIndex = 0;
  endIndex = this.paginacion;
  pageIndex = 0;

  //filtros
  num_doc_usr = '';
  apellido1 = '';
  apellido2 = '';
  especialidad = '';
  profesional = '';
  descripcion = '';
  sinCoincidencia = false;

  // iniciar id en 0
  id = 0;

  constructor(
    private ngxCsvParser: NgxCsvParser,
    private _sms: MessagesService,
    private router: Router
  ) {}

  @ViewChild('fileImportInput') fileImportInput: any;

  fileChangeListener($event: any): void {
    this.files = $event.srcElement.files;
    this.header =
      (this.header as unknown as string) === 'true' || this.header === true;

    //console.log(this.files);

    this.ngxCsvParser
      .parse(this.files[0], {
        header: this.header,
        delimiter: this.delimitador,
      })
      .pipe()
      .subscribe(
        (result: any) => {
          //console.log('Result', result);

          this.csvRecords = result;
          this.csvRecordsFilter = result;

          if (this.csvRecords.length > 0) {
            for (const iterator of this.csvRecords) {
              this.id++;

              iterator.id = this.id;
              iterator.estado = this.estado;
              iterator.fecha_proceso = new Date();

              iterator.apellido1 = this.removeAccents(iterator.apellido1);
              iterator.apellido2 = this.removeAccents(iterator.apellido2);
              iterator.nombre1 = this.removeAccents(iterator.nombre1);
              iterator.nombre2 = this.removeAccents(iterator.nombre2);
              iterator.especialidad = this.removeAccents(iterator.especialidad);
              iterator.profesional = this.removeAccents(iterator.profesional);
              iterator.descripcion = this.removeAccents(iterator.descripcion);

              //console.log(iterator);
            }
          }
        },
        (error: NgxCSVParserError) => {
          console.log('Error', error);
        }
      );
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
    this.errores = 0;
    if (this.coneccion) {
      for (const message of messages) {
        const {
          id,
          num_doc_usr,
          apellido1,
          apellido2,
          nombre1,
          nombre2,
          celular,
          fec_cita,
          hora_cita,
          especialidad,
          profesional,
          descripcion,
        } = message;
        const recordatorio = `Estimado sr(a) ${nombre1} ${nombre2} ${apellido1} ${apellido2} le recordamos la oportuna asistencia a su cita el dia ${fec_cita} a las ${hora_cita} por ${especialidad} con el profesional ${profesional} para ${descripcion}`;
        //console.log(recordatorio);
        this._sms.sendMessage(celular, recordatorio).subscribe(
          (res: any) => {
            //console.log('Mensaje enviado !!');
            //console.log(res);
            this.respuesta = res;
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: this.respuesta.status,
              text: `${this.csvRecords.length} Mensajes enviados !!`,
              showConfirmButton: false,
              timer: 3000,
            });

            this.cambiarEstado(id, 'ENVIADO');
          },
          (err) => {
            console.log(err);
            this.errores++;
            if (this.errores < 2) {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error al enviar los mensajes !!',
                text: 'Revisa la coneccion!',
                showConfirmButton: false,
                timer: 3000,
              });
            }

            this.cambiarEstado(id, 'ERROR');
            return (this.coneccion = false);
          }
        );
      }
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
    this.csvRecords = this.csvRecordsFilter;

    //console.log('array mayor a 0');

    //console.log(obj.id);
    const index = this.csvRecords.findIndex((records) => records.id === obj.id);
    //console.log(index);
    this.csvRecords.splice(index, 1);
    //console.log(this.csvRecords);
    this.filterForItems(
      this.num_doc_usr,
      this.apellido1,
      this.apellido2,
      this.especialidad,
      this.profesional
    );

    //console.log(this.csvRecords.length);
    this.updateIndex(this._sms.pageIndex);

    if (this.csvRecords.length < 1) {
      this.num_doc_usr = '';
      this.apellido1 = '';
      this.apellido2 = '';
      this.especialidad = '';
      this.profesional = '';

      this.filterForItems(
        this.num_doc_usr,
        this.apellido1,
        this.apellido2,
        this.especialidad,
        this.profesional
      );
    }
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
        this.id = 0;
      }
    });
  }

  resetFile() {
    (this.fileImportInput as ElementRef).nativeElement.value = '';
  }

  filterItems(
    query: string,
    query2: string,
    query3: string,
    query4: string,
    query5: string
  ) {
    return this.csvRecords.filter(function (el) {
      return (
        el.num_doc_usr.toLowerCase().indexOf(query.toLowerCase()) > -1 &&
        el.apellido1.toLowerCase().indexOf(query2.toLowerCase()) > -1 &&
        el.apellido2.toLowerCase().indexOf(query3.toLowerCase()) > -1 &&
        el.especialidad.toLowerCase().indexOf(query4.toLowerCase()) > -1 &&
        el.profesional.toLowerCase().indexOf(query5.toLowerCase()) > -1
      );
    });
  }

  filterForItems(
    nNumDoc: any,
    nApellido1: any,
    nApellido2: any,
    nEspecialidad: any,
    nProfesional: any
  ) {
    this.csvRecords = this.csvRecordsFilter;
    this.num_doc_usr = nNumDoc;
    this.apellido1 = nApellido1;
    this.apellido2 = nApellido2;
    this.especialidad = nEspecialidad;
    this.profesional = nProfesional;
    //console.log(this.num_doc_usr,this.apellido1,this.apellido2,this.especialidad,this.profesional);

    this.csvRecords = this.filterItems(
      this.num_doc_usr,
      this.apellido1,
      this.apellido2,
      this.especialidad,
      this.profesional
    );
    //console.log(this.csvRecords.length);
    this.updateIndex(this._sms.pageIndex);

    if (this.csvRecords.length == 0) {
      //console.log('No existen coincidencias');

      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'No existen coincidencias !!',
        //text: 'Revisa la coneccion!',
        showConfirmButton: false,
        timer: 3000,
      });

      this.sinCoincidencia = true;

      //console.log(this.sinCoincidencia);

      this.num_doc_usr = '';
      this.apellido1 = '';
      this.apellido2 = '';
      this.especialidad = '';
      this.profesional = '';

      this.filterForItems(
        this.num_doc_usr,
        this.apellido1,
        this.apellido2,
        this.especialidad,
        this.profesional
      );
    } else if (this.csvRecords.length <= 10) {
      this.updateIndex(0);
    }
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

  removeAccents(str: string) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace('á', 'a')
      .replace('é', 'e')
      .replace('í', 'i')
      .replace('ó', 'o')
      .replace('ú', 'u')
      .replace('´', '')
      .toUpperCase();
  }
}
