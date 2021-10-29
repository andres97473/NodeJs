import { Component, ViewChild } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';

@Component({
  selector: 'app-csv-messages',
  templateUrl: './csv-messages.component.html',
  styleUrls: ['./csv-messages.component.css'],
})
export class CsvMessagesComponent {
  csvRecords: any[] = [];
  header: boolean = true;

  paginacion = 5;

  starIndex = 0;
  endIndex = this.paginacion;

  constructor(private ngxCsvParser: NgxCsvParser) {}

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
          console.log('Result', result);
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
}
