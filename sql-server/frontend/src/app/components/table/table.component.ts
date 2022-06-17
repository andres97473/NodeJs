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

  // TODO: Generar separadores
  generarSeparadores(inicio: number, fin: number) {
    let conteo1 = 1000;
    let conteo2 = 2100;
    let conteo3 = -900;
    let texto1 = '';
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

    const exp = new RegExp(texto1);
    // console.log(exp);
    return exp;
  }

  selectRow(row: HistoriaI) {
    const separadores = this.generarSeparadores(1000, 3000);
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

    if (this.selectedRow.texto02) {
      const txt2 = this.splitString(this.selectedRow.texto02, separadores);
      this.texto2 = txt2;
    }

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
    } else if (string.includes('EVALUAR ALIMENTACION')) {
      separador = '     ';
    } else if (string.includes('MOTIVO DE CONSULTA/ENF')) {
      separador = ':';
      esPuntos = true;
    } else {
      separador = ':';
      esPuntos = true;
    }

    const split = this.splitString(string, separador);

    const obj = {
      largo: split[0].trim().split(' ')[0],
      orden: split[0].trim().split(' ')[1],
      codigo: esPuntos ? split[0] + ':' : split[0],
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
    const fechImpresion = new Date();
    const pdf = new PdfMakeWrapper();

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
          new Txt('HISTORIA CLINICA\n').fontSize(8.5).alignment('center').bold()
            .end,
          new Txt(`Fecha Impresion:      16/06/2022\n`)
            .fontSize(6.5)
            .alignment('right').end,
        ],
        // alignment: 'center',
        // style: 'header',
        margin: [5, 20, 5, 5],
      };
    });

    for (const hist of this.historia) {
      if (hist.largo.length > 0) {
        pdf.add(
          new Txt(hist.codigo + '   ')
            .fontSize(7)
            .bold()
            .background('#f1f1f1')
            .lineHeight(1.2).end
        );

        pdf.add(new Txt(hist.cuerpo).fontSize(7.5).alignment('justify').end);
        pdf.add(new Txt('\n').end);
      }
    }

    pdf.create().open();
  }
}
