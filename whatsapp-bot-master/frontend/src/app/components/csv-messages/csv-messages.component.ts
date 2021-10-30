import { Component, ViewChild } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
import { RecordatorioModel } from '../../models/recordatorio.model';
import { MessagesService } from '../../services/messages.service';


@Component({
  selector: 'app-csv-messages',
  templateUrl: './csv-messages.component.html',
  styleUrls: ['./csv-messages.component.css'],
})
export class CsvMessagesComponent {
  csvRecords: RecordatorioModel[] = [];
  header: boolean = true;

  paginacion = 5;

  starIndex = 0;
  endIndex = this.paginacion;

  constructor(private ngxCsvParser: NgxCsvParser, private _sms:MessagesService) {}

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

  sendMessagesCsv(messages:RecordatorioModel[]){
    //console.log(messages);
    for (const message of messages) {
      const {num_doc_usr,apellido1,apellido2,nombre1,nombre2,celular,fec_hora_cita,especialidad,profesional,descripcion}=  message
      const recordatorio=`Estimado sr(a) ${nombre1} ${nombre2} ${apellido1} ${apellido2} le recordamos la oportuna asistencia a su cita el dia ${fec_hora_cita} por ${especialidad} con el profesional ${profesional} para ${descripcion}`;      
      //console.log(recordatorio);

      this._sms.sendMessage(celular,recordatorio);
      
    }
  }

}
