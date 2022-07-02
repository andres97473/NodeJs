import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HistoriasService } from '../../services/historias.service';
import { HistoriaI } from '../../interface/historia';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';

import {
  PdfMakeWrapper,
  Txt,
  Canvas,
  Rect,
  Table,
  Cell,
  Columns,
  Img,
} from 'pdfmake-wrapper';
import { ITable, IImg, IText } from 'pdfmake-wrapper/lib/interfaces';

// declare fonts
//import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// ignorar el error
import * as pdfFonts from '../../../assets/fonts/custom-fonts.js';
import { PacienteI } from '../../interface/paciente';

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
    'tipo_atencion',
    'num_orden',
    'fecha_dig',
    'nombre_estudio',
    'medico',
    'especialidad_historia',
  ];
  dataSource: HistoriaI[] = [];

  // prueba de datos
  dataApi: HistoriaI[] = [];

  historia: any[] = [];
  diagnostico = '';
  diagnosticoHist = 'Sin Diagnostico';
  firma_ruta = 'assets/Firmas/firma.png';

  documento_ruta = null;

  paciente: PacienteI = {
    nombre_paciente: '',
    barrio_nombre: '',
    direccion: '',
    empresa_nombre: '',
    fecha_nac: '',
    edad: '',
    identificacion: '',
    no_historia: '',
    sexo: '',
    telefono: '',
  };

  texto1: string[] = [];
  texto2: string[] = [];

  selectedRow: HistoriaI = {
    no_historia: '',
    texto01: '',
    texto02: '',
    texto03: '',
  };

  // Formulario
  pacienteForm: FormGroup;

  constructor(
    private historiasService: HistoriasService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.iniciarFormulario();

    // TODO:
    // console.log(this.calcularEdad('2021-08-02', '2022-07-02'));
  }

  iniciarFormulario() {
    this.pacienteForm = this.fb.group({
      inputHistoria: ['', Validators.required],
    });
  }

  // onSubmit(): void {
  //   console.log(this.pacienteForm.value);
  // }

  buscarPaciente() {
    const historia = this.pacienteForm.value.inputHistoria;
    // console.log(historia);

    this.historia = [];
    this.selectedRow = {};

    // buscar historia por numero de historia

    this.dataSource = [];

    this.historiasService.getHistoriasPaciente(historia).subscribe(
      (data: any) => {
        const nData = data.resultado.data[0];
        this.dataSource = nData;
        // console.log(this.dataSource);
        const nPaciente = nData[0];
        this.paciente = {
          nombre_paciente:
            nPaciente.ap_apellido1 +
            ' ' +
            nPaciente.ap_apellido2 +
            ' ' +
            nPaciente.ap_nombre1 +
            ' ' +
            nPaciente.ap_nombre2,
          barrio_nombre: nPaciente.barrio_nombre,
          direccion: nPaciente.direccion,
          empresa_nombre: nPaciente.empresa_nombre,
          fecha_nac: nPaciente.fecha_nac,
          edad: this.calcularEdad(nPaciente.fecha_nac, new Date()),
          identificacion: nPaciente.identificacion,
          no_historia: nPaciente.no_historia,
          sexo: nPaciente.sexo === 'M' ? 'Masculino' : 'Femenino',
          telefono: nPaciente.telefono,
        };
        // console.log(this.paciente);
      },
      (error) => {
        console.log(error);
      }
    );

    // this.historiasService.getCodigos().subscribe((data: any) => {
    //   const nData = data.codigos[0];
    //   this.dataApi = nData;

    //   if (this.dataApi.length > 0) {
    //     console.log(this.getCodigos(this.dataApi));
    //   }
    // });
  }

  buscarPaciente2() {
    const historia = this.pacienteForm.value.inputHistoria;
    // console.log(historia);

    // buscar historia por numero de historia

    this.dataSource = [];
    this.historiasService.getHistorias().subscribe((data: any) => {
      const nData = data.resultado[0];
      this.dataSource = nData;
      // console.log(this.dataSource);
      const nPaciente = nData[0];
      this.paciente = {
        nombre_paciente:
          nPaciente.ap_apellido1 +
          ' ' +
          nPaciente.ap_apellido2 +
          ' ' +
          nPaciente.ap_nombre1 +
          ' ' +
          nPaciente.ap_nombre2,
        barrio_nombre: nPaciente.barrio_nombre,
        direccion: nPaciente.direccion,
        empresa_nombre: nPaciente.empresa_nombre,
        fecha_nac: nPaciente.fecha_nac,
        edad: this.calcularEdad(nPaciente.fecha_nac, new Date()),
        identificacion: nPaciente.identificacion,
        no_historia: nPaciente.no_historia,
        sexo: nPaciente.sexo === 'M' ? 'Masculino' : 'Femenino',
        telefono: nPaciente.telefono,
      };
      // console.log(this.paciente);
    });

    // this.historiasService.getCodigos().subscribe((data: any) => {
    //   const nData = data.codigos[0];
    //   this.dataApi = nData;

    //   if (this.dataApi.length > 0) {
    //     console.log(this.getCodigos(this.dataApi));
    //   }
    // });
  }

  // getCodigos(data: any) {
  //   const separadores = this.generarSeparadores();
  //   let nTxt = [];
  //   data.map((m) => {
  //     nTxt.push(m.texto01);
  //   });

  //   let nTxtSplit = [];

  //   for (const iterator of nTxt) {
  //     const txt1 = this.splitString(iterator, separadores);

  //     for (const nIterator of txt1) {
  //       // console.log(this.convertirString(nIterator));
  //       nTxtSplit.push(this.convertirString(nIterator));
  //     }
  //   }

  //   let ids = [];

  //   nTxtSplit = nTxtSplit.map((m) => {
  //     ids.push(m.id);
  //   });

  //   const result = ids.filter((item, index) => ids.indexOf(item) === index);

  //   return result;
  // }

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
    // archivo

    const separadores = this.generarSeparadores();
    // console.log(separadores);

    let myDiv = document.getElementById('specificDiv');
    if (myDiv) {
      myDiv.scrollTop = 0;
    }

    this.historia = [];
    this.selectedRow = row;

    this.documento_ruta = row.direccion_archivo;

    console.log(this.selectedRow);
    // console.log(this.selectedRow.direccion_archivo);

    // this.firma_ruta = 'assets/Firmas/MED' + this.selectedRow.md_codigo + '.bmp';

    this.setUrlImagen('assets/Firmas/MED' + this.selectedRow.md_codigo + '.bmp')
      .then((data) => {
        this.firma_ruta = data;
        // console.log(this.firma_ruta);
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log(this.firma_ruta);

    if (this.selectedRow.texto01) {
      const txt1 = this.splitString(this.selectedRow.texto01, separadores);

      this.texto1 = txt1;
    }

    // if (this.selectedRow.texto02) {
    //   const txt2 = this.splitString(this.selectedRow.texto02, separadores);
    //   this.texto2 = txt2;
    // }
    // console.log(this.historia);

    for (const iterator of this.texto1) {
      // console.log(this.convertirString(iterator));
      this.historia.push(this.convertirString(iterator));
    }

    // console.log(this.texto1);
    // console.log(this.texto2);

    if (this.diagnostico.length > 0) {
      const nDX = this.diagnostico.split('\n');

      // console.log(nDX[0].trim());
      this.diagnosticoHist = nDX[0].trim();
    }
    // console.log(this.diagnosticoHist);
    this.historia = this.historia.filter((h) => h.id != '-900');
  }

  getFiles() {
    const archivo = {
      // file: '9221-1088219367.pdf',
      file: this.selectedRow.direccion_archivo,
      path: 'D:\\Infosalud_sql\\base_info\\Img_Info\\',
    };

    this.historiasService.postFirmas(archivo).subscribe((response) => {
      let fileName = archivo.file;
      let blob: Blob = response.body as Blob;
      let a = document.createElement('a');
      a.target = '_blank';
      a.href = window.URL.createObjectURL(blob);

      a.click();
    });
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
    } else if (string.includes('DIAGNOSTICO:.')) {
      separador = '      ';
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

    // concatenar cuerpo
    for (let index = 1; index < split.length; index++) {
      obj.cuerpo += split[index] + ' ';
    }

    if (obj.id === '1006') {
      this.diagnostico = obj.cuerpo;
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

  // TODO: Generar pdf

  async generarPdf() {
    const colorFondo = '#f0f0f0';
    const pdf = new PdfMakeWrapper();

    // pdf.pageMargins([izquierda, arriba, derecha, abajo]);
    pdf.pageMargins([40, 80, 40, 60]);

    pdf.header(() => {
      return {
        text: [
          new Txt(`Folio No: ${this.selectedRow.num_orden}     \n`)
            .fontSize(6.5)
            .alignment('right')
            .lineHeight(1.2)
            .margin([0, 5, 0, 0])
            .background(colorFondo).end,
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

    pdf.footer((currentPage, pageCount) => {
      const page =
        'Pagina No:        ' + currentPage.toString() + ' de ' + pageCount;
      return {
        text: [
          new Txt(
            '___________________________________________________________________________\n'
          ).end,
          new Txt(page).fontSize(6.5).alignment('left').end,
        ],
        margin: [50, 15, 0, 0],
      };
    });

    // TODO: obj
    const obj = {
      nombre_paciente:
        this.selectedRow.ap_apellido1.trim() +
        ' ' +
        this.selectedRow.ap_apellido2.trim() +
        ' ' +
        this.selectedRow.ap_nombre1.trim() +
        ' ' +
        this.selectedRow.ap_nombre2.trim(),
      nombre_medico:
        this.selectedRow.md_apellido1.trim() +
        ' ' +
        this.selectedRow.md_apellido2.trim() +
        ' ' +
        this.selectedRow.md_nombre1.trim() +
        ' ' +
        this.selectedRow.md_nombre2.trim(),
      reg_medico: this.selectedRow.md_reg_medico,
      fecha_dig: this.selectedRow.fecha_dig,
      fecha_nac: this.selectedRow.fecha_nac,
      edad: this.calcularEdad(
        this.selectedRow.fecha_nac,
        this.selectedRow.fecha_dig
      ),
      estado_civil: 'UNION LIBRE',
      no_historia: this.selectedRow.no_historia,
      identificacion: this.selectedRow.identificacion,
      empresa: this.selectedRow.empresa_nombre,
      diagnostico: this.diagnosticoHist,
      sexo: this.selectedRow.sexo === 'M' ? 'Maxculino' : 'Femenino',
      telefono: this.selectedRow.telefono,
      municipio:
        this.selectedRow.municipio == 52560
          ? 'POTOSI (N)'
          : 'FUERA DEL MUNICIPIO',
      direccion: this.selectedRow.direccion,
    };

    // console.log(obj);

    pdf.add(
      new Table([
        // fila 1
        [
          new Txt('PACIENTE:'.trim()).fontSize(6.5).bold().end,
          new Txt(obj.nombre_paciente.trim().padEnd(35, ' '))
            .fontSize(6.5)
            .lineHeight(1.2)
            .background(colorFondo).end,
          new Txt('E.CIVIL:'.trim()).fontSize(6.5).bold().alignment('right')
            .end,
          new Txt(obj.estado_civil.trim().padEnd(20, ' '))
            .fontSize(6.5)
            .lineHeight(1.2)
            .background(colorFondo).end,
          new Txt('FECHA ATENCION:'.trim())
            .fontSize(6.5)
            .bold()
            .alignment('right').end,
          new Txt(String(obj.fecha_dig).trim().padEnd(33, ' '))
            .fontSize(6.5)
            .lineHeight(1.2)
            .background(colorFondo).end,
        ],
        // fila 2
        [
          new Txt('No HISTORIA:'.trim()).fontSize(6.5).bold().end,
          new Txt(obj.no_historia.trim().padEnd(35, ' '))
            .fontSize(6.5)
            .lineHeight(1.2)
            .background(colorFondo).end,
          new Txt('EDAD:'.trim()).fontSize(6.5).bold().alignment('right').end,
          new Txt(String(obj.edad).trim().padEnd(20, ' '))
            .fontSize(6.5)
            .lineHeight(1.2)
            .background(colorFondo).end,
          new Txt('TELEFONO:'.trim()).fontSize(6.5).bold().alignment('right')
            .end,
          new Txt(obj.telefono.trim().padEnd(33, ' '))
            .fontSize(6.5)
            .lineHeight(1.2)
            .background(colorFondo).end,
        ],
        // fila 3
        [
          new Txt('IDENTIFICACION:'.trim()).fontSize(6.5).bold().end,
          new Txt(obj.identificacion.trim().padEnd(35, ' '))
            .fontSize(6.5)
            .lineHeight(1.2)
            .background(colorFondo).end,
          new Txt('SEXO:'.trim()).fontSize(6.5).bold().alignment('right').end,
          new Txt(obj.sexo.trim().padEnd(20, ' '))
            .fontSize(6.5)
            .lineHeight(1.2)
            .background(colorFondo).end,
          new Txt('MUNICIPIO:'.trim()).fontSize(6.5).bold().alignment('right')
            .end,
          new Txt(obj.municipio.padEnd(33, ' '))
            .fontSize(6.5)
            .lineHeight(1.2)
            .background(colorFondo).end,
        ],
        // fila 4
        [
          new Txt('EMPRESA:'.trim()).fontSize(6.5).bold().end,
          new Txt(String(obj.empresa).trim().padEnd(35, ' '))
            .fontSize(6.5)
            .lineHeight(1.2)
            .background(colorFondo).end,
          new Txt('FEC. NAC:').fontSize(6.5).bold().alignment('right').end,
          new Txt(String(obj.fecha_nac).padEnd(20, ' '))
            .fontSize(6.5)
            .lineHeight(1.2)
            .background(colorFondo).end,
          new Txt('DIRECCION:'.trim()).fontSize(6.5).bold().alignment('right')
            .end,
          new Txt(String(obj.direccion).trim().padEnd(33, ' '))
            .fontSize(6.5)
            .lineHeight(1.2)
            .background(colorFondo).end,
        ],
        // fila 5
        [
          new Txt('DIAGNOSTICO:'.trim()).fontSize(6.5).bold().end,
          new Cell(
            new Txt(String(obj.diagnostico).trim().padEnd(80, ' '))
              .fontSize(6.5)
              .lineHeight(1.2)
              .background(colorFondo).end
          ).colSpan(5).end,
        ],
      ])
        .widths([60, 120, 40, 80, 80, 90])
        .layout({
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 0.3 : 0;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 0.3 : 0;
          },
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? 'gray' : 'white';
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 'gray' : 'white';
          },
        }).end
    );

    pdf.add(new Txt('\n').end);

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
            .background(colorFondo).end
        );

        pdf.add(
          new Txt(hist.cuerpo).font('cour').fontSize(7.5).alignment('justify')
            .end
        );

        pdf.add(new Txt('\n').end);
      }
    }

    // lineas
    pdf.add([
      new Canvas([new Rect([0, 0], [515, 0.3]).color('black').end]).end,
      new Canvas([new Rect([0, 0], [515, 0.3]).color('black').end]).margin([
        0, 2, 0, 0,
      ]).end,
    ]);

    // firmas
    pdf.add(
      new Columns([
        await new Img(this.firma_ruta).width(120).margin([50, 4, 0, 0]).build(),
        new Txt('').end,
      ]).end
    );
    pdf.add(
      new Columns([
        new Txt('_________________________________').end,
        new Txt('_________________________________').alignment('center').end,
      ]).end
    );

    pdf.add(
      new Columns([
        new Columns([
          new Txt('MEDICO:').fontSize(6.5).bold().width(60).margin([0, 3, 0, 0])
            .end,
          new Table([[new Txt(obj.nombre_medico).fontSize(6.5).end]])
            .widths([160])
            .layout({
              hLineColor: function () {
                return 'gray';
              },
              vLineColor: function () {
                return 'gray';
              },
            }).end,
        ]).end,
        new Txt('FIRMA PACIENTE:').fontSize(6.5).bold().alignment('center').end,
      ]).end
    );
    pdf.add(
      new Columns([
        new Columns([
          new Txt('REG MEDICO:')
            .fontSize(6.5)
            .bold()
            .width(60)
            .margin([0, 3, 0, 0]).end,
          new Table([[new Txt(obj.reg_medico).fontSize(6.5).end]])
            .widths([120])
            .layout({
              hLineColor: function () {
                return 'gray';
              },
              vLineColor: function () {
                return 'gray';
              },
            }).end,
        ]).end,
        new Txt('').end,
      ]).end
    );

    pdf.create().open();
  }

  // TODO: calcular edad
  calcularEdad(fecha_inicio, fecha_fin): string {
    let cumpleanos = new Date(fecha_inicio);
    let fin = new Date(fecha_fin);

    let total_months =
      (fin.getFullYear() - cumpleanos.getFullYear()) * 12 +
      (fin.getMonth() - cumpleanos.getMonth());

    let years = Math.floor(total_months / 12);
    let months = total_months - years * 12;

    return years + ' Años ' + months + ' Meses';
  }

  // prueba de imagen
  async pruebaPdf(): Promise<string> {
    const pdf = new PdfMakeWrapper();

    try {
      const imagen: IImg = await new Img(this.firma_ruta).width(100).build();

      pdf.add(imagen);

      pdf.create().open();
      return this.firma_ruta;
    } catch (error) {
      console.log(error);
      const imagen: IImg = await new Img('assets/Firmas/firma.png')
        .width(100)
        .build();

      pdf.add(imagen);

      pdf.create().open();
      return 'assets/Firmas/firma.png';
    }
  }

  // set url imagen
  async setUrlImagen(url: string) {
    const pdf = new PdfMakeWrapper();
    let ruta = 'assets/Firmas/firma.png';

    try {
      const imagen: IImg = await new Img(url).width(100).build();

      ruta = url;
    } catch (error) {
      // console.log(error);
      ruta = 'assets/Firmas/firma.png';
    }
    return ruta;
  }
}
