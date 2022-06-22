import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HistoriasService } from '../../services/historias.service';
import { HistoriaI } from '../../interface/historia';

import { PdfMakeWrapper, Txt, Canvas, Rect } from 'pdfmake-wrapper';

// declare fonts
//import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// TODO: ignorar el error
import * as pdfFonts from '../../../assets/fonts/custom-fonts.js';

// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts, {
  tahoma: {
    normal: 'tahoma.ttf',
    bold: 'tahomabd.ttf',
    italics: 'tahoma.ttf',
    bolditalics: 'tahomabd.ttf',
  },
  cour: {
    normal: 'cour.ttf',
    bold: 'courbd.ttf',
    italics: 'cour.ttf',
    bolditalics: 'courbd.ttf',
  },
});

PdfMakeWrapper.useFont('tahoma');

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

  // prueba de datos
  dataApi: HistoriaI[] = [];

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
    });

    this.historiasService.getCodigos().subscribe((data: any) => {
      const nData = data.codigos[0];
      this.dataApi = nData;

      if (this.dataApi.length > 0) {
        // console.log(this.getCodigos(this.dataApi));
      }
    });
  }

  // TODO: prueba de codigos
  getCodigos(data: any) {
    const separadores = this.generarSeparadores();
    let nTxt = [];
    data.map((m) => {
      nTxt.push(m.texto01);
    });

    let nTxtSplit = [];

    for (const iterator of nTxt) {
      const txt1 = this.splitString(iterator, separadores);

      for (const nIterator of txt1) {
        // console.log(this.convertirString(nIterator));
        nTxtSplit.push(this.convertirString(nIterator));
      }
    }

    let ids = [];

    nTxtSplit = nTxtSplit.map((m) => {
      ids.push(m.id);
    });

    const result = ids.filter((item, index) => ids.indexOf(item) === index);

    return result;
  }

  generarSeparadores() {
    let texto1 = '(?=';
    let conteo1 = 1000;
    let conteo2 = 2100;
    let conteo3 = -900;
    for (let index = 0; index < 900; index++) {
      texto1 += conteo1 + ' |';
      conteo1++;
    }
    for (let index = 0; index < 2000; index++) {
      texto1 += conteo2 + ' |';
      conteo2++;
    }
    for (let index = 0; index < 700; index++) {
      texto1 += conteo3 + ' |';
      conteo3++;
    }
    texto1 = texto1.substring(0, texto1.length - 1);
    texto1 += ')';

    const exp = new RegExp(texto1, 'g');
    // console.log(exp);
    return exp;
  }

  selectRow(row: HistoriaI) {
    const separadores = this.generarSeparadores();
    // console.log(separadores);

    let myDiv = document.getElementById('specificDiv');
    if (myDiv) {
      myDiv.scrollTop = 0;
    }

    this.historia = [];
    this.selectedRow = row;
    console.log(this.selectedRow);

    if (this.selectedRow.texto01) {
      const txt1 = this.splitString(this.selectedRow.texto01, separadores);

      this.texto1 = txt1;
    }

    // if (this.selectedRow.texto02) {
    //   const txt2 = this.splitString(this.selectedRow.texto02, separadores);
    //   this.texto2 = txt2;
    // }

    for (const iterator of this.texto1) {
      console.log(this.convertirString(iterator));
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
    let esPuntos = false;

    if (string.includes('FACTORES DE RIESGO S.M.')) {
      separador = '  ';
    } else if (string.includes('DIAGNOSTICO CIE10')) {
      separador = '        ';
    } else if (string.includes('DIAGNOSTICO DE INGRESO:')) {
      separador = '  ';
    } else if (string.includes('01ANTECEDENTES')) {
      separador = '::';
    } else if (string.includes('TIENE DIARREA?')) {
      separador = '           ';
    } else if (string.includes('VERIFICAR VACUNACION')) {
      separador = '     ';
    } else if (string.includes('TIENE FIEBRE')) {
      separador = '            ';
    } else if (string.includes('TIENE PROBLEMA DE OIDO?')) {
      separador = '  ';
    } else if (string.includes('VERIFICAR SALUD BUCAL')) {
      separador = '    ';
    } else if (string.includes('VERIFICAR DESNUTRICION')) {
      separador = '   ';
    } else if (string.includes('VERIFICAR ANEMIA')) {
      separador = '         ';
    } else if (string.includes('VERIFICAR MALTRATO')) {
      separador = '       ';
    } else if (string.includes('EVALUAR DESARROLLO')) {
      separador = '       ';
    } else if (string.includes('MOTIVO DE CONSULTA/ENF')) {
      separador = ':';
      esPuntos = true;
    } else {
      separador = ':';
      esPuntos = true;
    }

    const split = this.splitString(string, separador);

    const obj = {
      id: split[0].trim().split(' ')[0],
      largo: split[0].trim().split(' ')[1],
      orden: split[0].trim().split(' ')[2] || ' ',
      cuerpo: '',
      codigo: '',
    };

    for (let index = 1; index < split.length; index++) {
      obj.cuerpo += split[index] + ' ';
    }

    obj.orden = obj.orden.substring(0, 2);

    const nSplit = split[0].trim().split(' ');

    // console.log(nSplit);

    for (let index = 2; index < nSplit.length; index++) {
      // console.log(nSplit[index]);
      obj.codigo += nSplit[index] + ' ';
    }

    obj.codigo = obj.codigo.trim();
    obj.codigo = obj.codigo.slice(2);

    if (esPuntos) {
      obj.codigo += ':';
    }

    return obj;
  }

  // TODO: corregir o buscar fecha de otro campo
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

  // TODO: Generar pdf

  generarPdf() {
    const pdf = new PdfMakeWrapper();

    // pdf.pageMargins([izquierda, arriba, derecha, abajo]);
    pdf.pageMargins([40, 80, 40, 60]);

    pdf.header(() => {
      return {
        text: [
          new Txt('CENTRO HOSPITAL LUIS ANTONIO MONTERO ESE\n')
            .fontSize(8.5)
            .alignment('center')
            .bold().end,
          new Txt('Direccion: BARRIO LA UNION POTOSI Telefono: 7263046.\n')
            .fontSize(8.5)
            .alignment('center').end,
          new Txt(`${this.selectedRow.nombre_estudio}\n`)
            .fontSize(8.5)
            .alignment('center')
            .bold().end,
          new Txt(`Fecha Impresion:      16/06/2022\n`)
            .fontSize(6.5)
            .alignment('right').end,
        ],
        // alignment: 'center',
        // style: 'header',
        margin: [40, 20, 40, 5],
      };
    });

    for (const hist of this.historia) {
      if (hist.largo.length > 0) {
        pdf.add(
          new Canvas([new Rect([0, 0], [515, 0.3]).color('#c0c0c0').end]).end
        );

        pdf.add(
          new Txt(hist.codigo.trim().padEnd(150, ' '))
            .fontSize(6.5)
            .bold()
            .lineHeight(1.2)
            .margin([0, 5, 0, 0])
            .background('#dedede').end
        );

        pdf.add(
          new Txt(hist.cuerpo).font('cour').fontSize(7.5).alignment('justify')
            .end
        );

        pdf.add(new Txt('\n').end);
      }
    }

    pdf.create().open();
  }
}
