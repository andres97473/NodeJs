import { Component, ViewChild } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
import { RecordatorioModel, Respuesta } from '../../models/recordatorio.model';
import { MessagesService } from '../../services/messages.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-csv-messages',
  templateUrl: './csv-messages.component.html',
  styleUrls: ['./csv-messages.component.css'],
})
export class CsvMessagesComponent {
  csvRecords: RecordatorioModel[] = [];
  csvRecordsFilter: RecordatorioModel[] = [];
  header: boolean = true;

  respuesta: Respuesta = {
    send: false,
    status: 'no enviado',
  };

  sinCoincidencia = false;

  paginacion = 10;

  starIndex = 0;
  endIndex = this.paginacion;

  nextId = 0;
  num_doc_usr = '';
  apellido1 = '';
  apellido2 = '';
  especialidad = '';
  profesional = '';
  id = 0;

  constructor(
    private ngxCsvParser: NgxCsvParser,
    private _sms: MessagesService
  ) {}

  @ViewChild('fileImportInput') fileImportInput: any;

  fileChangeListener($event: any): void {
    const files = $event.srcElement.files;
    this.header =
      (this.header as unknown as string) === 'true' || this.header === true;

    this.ngxCsvParser
      .parse(files[0], { header: this.header, delimiter: ',' })
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

  updateIndex(pageIndex: any) {
    this.starIndex = pageIndex * this.paginacion;
    this.endIndex = this.starIndex + this.paginacion;
  }

  sendMessagesCsv(messages: RecordatorioModel[]) {
    //console.log(messages);
    for (const message of messages) {
      const {
        num_doc_usr,
        apellido1,
        apellido2,
        nombre1,
        nombre2,
        celular,
        fec_hora_cita,
        especialidad,
        profesional,
        descripcion,
      } = message;
      const recordatorio = `Estimado sr(a) ${nombre1} ${nombre2} ${apellido1} ${apellido2} le recordamos la oportuna asistencia a su cita el dia ${fec_hora_cita} por ${especialidad} con el profesional ${profesional} para ${descripcion}`;
      //console.log(recordatorio);
      this._sms.sendMessage(celular, recordatorio).subscribe(
        (res: any) => {
          //console.log('Mensaje enviado !!');
          //console.log(res);
          this.respuesta = res;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: this.respuesta.status,
            text: `${this.csvRecords.length} Mensajes enviados !!`,
            showConfirmButton: false,
            timer: 3000,
          });
        },
        (err) => {
          console.log(err);
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error al enviar los mensajes !!',
            text: 'Revisa la coneccion!',
            showConfirmButton: false,
            timer: 3000,
          });
        }
      );
    }
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

    this.updateIndex(0);

    if (this.csvRecords.length == 0) {
      //console.log('No existen coincidencias');

      Swal.fire({
        position: 'top-end',
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
    }
  }

  alert(sends: number) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: `Se enviaron ${sends} mensajes`,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
