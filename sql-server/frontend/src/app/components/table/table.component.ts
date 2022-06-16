import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HistoriasService } from '../../services/historias.service';
import { HistoriaI } from '../../interface/historia';

import { PdfMakeWrapper, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'; // fonts provided for pdfmake
// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = [
    'especialidad_historia',
    'num_orden',
    'fecha_dig',
    'nombre_estudio',
    'medico',
  ];
  dataSource: HistoriaI[] = [];

  historia: any[] = [];

  texto1: string[] = [];
  texto2: string[] = [];

  selectedRow: HistoriaI = {
    no_historia: '',
    texto01: '',
    texto02: '',
    texto03: '',
  };

  constructor(private historiasService: HistoriasService) {}

  ngOnInit(): void {
    this.historiasService.getHistorias().subscribe((data: any) => {
      const nData = data.resultado[0];
      this.dataSource = nData;
      console.log(this.dataSource);
    });
  }

  selectRow(row: HistoriaI) {
    this.historia = [];
    this.selectedRow = row;
    console.log(this.selectedRow);

    if (this.selectedRow.texto01) {
      const txt1 = this.splitString(
        this.selectedRow.texto01,
        /1000 |1001 |1002 |1003 |1004 |1005 |1006 |1007 |1008 |1009 |1010 |1011 |1204 |1025 |1028 |1030 |1031 |1062 |1065 |1036 |1038 |1350 |1150 |1242 |1243 |1244|1245 |1284 |1345 |1056 |1344 |1047 |1171 |1306 |1029 |1151 |1069 |1079 |1152 |1077 |1078 |1336 |1337 |1338 |1153 |1359 |1081 |-900 |1034 |9999 |1233 |1234 |1164 |1246 |1166 |1167 |1023 |1161 |1162 |1163 |1165 |1380 |1439 /
      );

      this.texto1 = txt1;
    }

    if (this.selectedRow.texto02) {
      const txt2 = this.splitString(
        this.selectedRow.texto02,
        /-400 |-401 |-402 |-403 |-404 |-405 |-406 |-407 |-408 |-409 |-410 |-411 |8100 |8000 |8001 |8002 |8003 | 8004|8005 |8006 |8007 |1345 |1056 |1344 /
      );
      this.texto2 = txt2;
    }

    for (const iterator of this.texto1) {
      // console.log(this.convertirString(iterator));
      this.historia.push(this.convertirString(iterator));
    }

    // console.log(this.texto1);
    // console.log(this.texto2);
  }

  splitString(string: string, separator: any = ' ') {
    const split = string.split(separator);

    return split;
  }

  convertirString(string: string) {
    // console.log(string);
    let separador = '';
    if (string.includes('FACTORES DE RIESGO S.M.')) {
      separador = '  ';
    } else if (string.includes('DIAGNOSTICO CIE10')) {
      separador = '        ';
    } else if (string.includes('01ANTECEDENTES')) {
      separador = '::';
    } else {
      separador = ':';
    }

    const split = this.splitString(string, separador);

    const obj = {
      largo: split[0].trim().split(' ')[0],
      orden: split[0].trim().split(' ')[1],
      codigo: split[0],
      cuerpo: '',
    };

    for (var i = 1; i < split.length; i++) {
      // console.log(split[i]);
      obj.cuerpo += split[i] + ':';
    }

    let cuerpo = obj.cuerpo;
    let orden = obj.orden || '';
    cuerpo = cuerpo.substring(0, cuerpo.length - 1);
    orden = orden.substring(0, 2);
    obj.cuerpo = cuerpo;
    obj.orden = orden;
    // console.log(cuerpo);
    obj.codigo = obj.codigo.split(obj.orden.trim())[1];

    return obj;
  }

  convertirFecha(date: string) {
    var time = new Date(date);
    const dateFormat = time.toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      hour12: true,
      minute: 'numeric',
    });
    return dateFormat;
  }

  generarPdf() {
    const pdf = new PdfMakeWrapper();

    pdf.add(new Txt('HISTORIA CLINICA\n').alignment('center').bold().end);

    for (const hist of this.historia) {
      pdf.add(new Txt(hist.codigo).bold().end);
      pdf.add(new Txt(hist.cuerpo).fontSize(10).alignment('justify').end);
      pdf.add(new Txt('\n').end);
    }

    pdf.create().open();
  }
}
