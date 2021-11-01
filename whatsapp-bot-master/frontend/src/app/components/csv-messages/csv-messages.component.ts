import { Component, ViewChild } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
import { RecordatorioModel } from '../../models/recordatorio.model';
import { MessagesService } from '../../services/messages.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-csv-messages',
  templateUrl: './csv-messages.component.html',
  styleUrls: ['./csv-messages.component.css'],
})
export class CsvMessagesComponent {
  csvRecords: RecordatorioModel[] = [];
  csvRecordsFilter: RecordatorioModel[] = [];
  header: boolean = true;

  paginacion = 5;

  starIndex = 0;
  endIndex = this.paginacion;

  nextId=0;
  apellido1='';
  apellido2='';
  id=0;

  constructor(private ngxCsvParser: NgxCsvParser, private _sms:MessagesService) {

    
    
  }

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

          if(this.csvRecords.length>0){
            
            for (const iterator of this.csvRecords) {
              this.id++;
              iterator.id=this.id;
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

  sendMessagesCsv(messages:RecordatorioModel[]){
    //console.log(messages);
    for (const message of messages) {
      const {num_doc_usr,apellido1,apellido2,nombre1,nombre2,celular,fec_hora_cita,especialidad,profesional,descripcion}=  message
      const recordatorio=`Estimado sr(a) ${nombre1} ${nombre2} ${apellido1} ${apellido2} le recordamos la oportuna asistencia a su cita el dia ${fec_hora_cita} por ${especialidad} con el profesional ${profesional} para ${descripcion}`;      
      //console.log(recordatorio);

      this._sms.sendMessage(celular,recordatorio);
      
    }
  }


  eliminarItem(obj:RecordatorioModel){
    this.csvRecords = this.csvRecordsFilter

    //console.log(obj.id);
    const index = this.csvRecords.findIndex(records => records.id === obj.id);

    console.log(index);

    this.csvRecords.splice(index, 1)
    console.log(this.csvRecords); 

    this.filterForItems(this.apellido1,this.apellido2)
    
  }

  
 
 filterItems(query:string,query2:string) {
   
   
   return this.csvRecords.filter(function(el) {
     return el.apellido1.toLowerCase().indexOf(query.toLowerCase()) > -1 
     && el.apellido2.toLowerCase().indexOf(query2.toLowerCase()) > -1;
     
     
    })
    
  }


  filterForItems(nApellido1:any,nApellido2:any){
    this.csvRecords = this.csvRecordsFilter
    this.apellido1=nApellido1
    this.apellido2=nApellido2
    console.log(this.apellido1,this.apellido2);

    this.csvRecords=this.filterItems(this.apellido1,this.apellido2);
    this.updateIndex(0)


  }

  



}
