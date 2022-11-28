import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatRow, MatTableDataSource } from '@angular/material/table';
import { HistoriasService } from '../../services/historias.service';
import { HistoriaI } from '../../interface/historia';

import {
  PdfMakeWrapper,
  Txt,
  Canvas,
  Rect,
  Table,
  Cell,
  Columns,
  Img,
  PageReference,
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
  selector: 'app-historia',
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.scss'],
})
export class HistoriaComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'tipo_atencion',
    'num_orden',
    'fecha_dig',
    'nombre_estudio',
    'especialidad',
    'medico',
    'anulado',
  ];

  // filtros
  filterValues: any = {};
  numFolios = 0;
  notas: boolean = true;
  filtroAnulado: boolean = true;
  filtroAdjuntos: boolean = true;
  filtroNotas: boolean = true;
  filtroOdontologia: boolean = true;
  filtroUrgencias: boolean = true;

  dataSource = new MatTableDataSource<HistoriaI>([]);
  selection = new SelectionModel<HistoriaI>(true, []);

  // prueba de datos
  dataApi: HistoriaI[] = [];

  // tablas
  especialidades = [];
  tipoAtencion = [];

  historia: any[] = [];
  historiasCheck: HistoriaI[] = [];
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
    this.historiasService.getEspecialidades().subscribe((resp: any) => {
      this.especialidades = resp.especialidad;
      // console.log(resp.especialidad);
    });

    this.historiasService.getTipoAtencion().subscribe((resp: any) => {
      this.tipoAtencion = resp.tipoAtencion;
      // console.log(resp.tipoAtencion);
    });
    this.iniciarFormulario();
  }

  crearPredicado() {
    this.dataSource.filterPredicate = (
      data: HistoriaI,
      filter: string
    ): boolean => {
      const filterValues = JSON.parse(filter);

      return (
        (this.notas
          ? true
          : data.nombre_estudio
              .trim()
              .toUpperCase()
              .indexOf(filterValues.nombre_estudio) == -1) &&
        (this.filtroAnulado
          ? true
          : data.filtroAnulado
              .trim()
              .toUpperCase()
              .indexOf(filterValues.filtroAnulado) == -1) &&
        (this.filtroAdjuntos
          ? true
          : data.filtroAdjuntos
              .trim()
              .toUpperCase()
              .indexOf(filterValues.filtroAdjuntos) == -1) &&
        (this.filtroNotas
          ? true
          : data.filtroNotas
              .trim()
              .toUpperCase()
              .indexOf(filterValues.filtroNotas) == -1) &&
        (this.filtroOdontologia
          ? true
          : data.filtroOdontologia
              .trim()
              .toUpperCase()
              .indexOf(filterValues.filtroOdontologia) == -1) &&
        (this.filtroUrgencias
          ? true
          : data.filtroUrgencias
              .trim()
              .toUpperCase()
              .indexOf(filterValues.filtroUrgencias) == -1)
      );
    };
  }

  crearFiltros() {
    this.dataSource.data.map((h) => {
      // filtro anulado
      if (h.anulado == -1) {
        h.filtroAnulado = 'SI';
      } else {
        h.filtroAnulado = 'NO';
      }
      // filtro adjuntos
      if (h.especialidad_historia == 3007) {
        h.filtroAdjuntos = 'SI';
      } else {
        h.filtroAdjuntos = 'NO';
      }
      // filtro adjuntos
      if (h.especialidad_historia == 3 || h.especialidad_historia == 135) {
        h.filtroNotas = 'SI';
      } else {
        h.filtroNotas = 'NO';
      }
      // filtro odontologia
      if (
        h.especialidad_historia == 41 ||
        h.especialidad_historia == 42 ||
        h.especialidad_historia == 43 ||
        h.especialidad_historia == 44
      ) {
        h.filtroOdontologia = 'SI';
      } else {
        h.filtroOdontologia = 'NO';
      }
      // filtro urgencias
      if (h.tipo_atencion == 3 || h.tipo_atencion == 0) {
        h.filtroUrgencias = 'SI';
      } else {
        h.filtroUrgencias = 'NO';
      }
    });
  }

  setCheckFilter() {
    this.filtroAnulado = true;
    this.filtroAdjuntos = true;
    this.filtroNotas = true;
    this.filtroOdontologia = true;
    this.filtroUrgencias = true;
  }

  applyFilter(column: string, filterValue: string) {
    this.filterValues[column] = filterValue;

    this.dataSource.filter = JSON.stringify(this.filterValues);

    this.historiasCheck = [];
    this.numFolios = this.dataSource.filteredData.length;
    this.selection = new SelectionModel<HistoriaI>(true, []);
  }

  onHistoriaSelected(row: HistoriaI) {
    this.selection.toggle(row);
    this.historiasCheck = this.selection.selected;

    let historias: HistoriaI[] = [];

    for (const iterator of this.historiasCheck) {
      this.setUrlImagen('assets/Firmas/MED' + iterator.md_codigo + '.bmp')
        .then((data) => {
          iterator.firma_med = data;
        })
        .catch((err) => {
          console.log(err);
        });

      historias.push(iterator);
    }

    // ordenar por fecha de dig
    historias.sort(
      (a, b) =>
        new Date(b.fecha_dig).getTime() - new Date(a.fecha_dig).getTime()
    );

    this.historiasCheck = historias;
    // console.table(this.historiasCheck);
  }

  isAllSelected() {
    return (
      this.selection.selected?.length == this.dataSource.filteredData?.length
    );
  }

  toggleAll() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.historiasCheck = this.selection.selected;
    } else {
      this.selection.select(...this.dataSource.filteredData);
      this.historiasCheck = this.selection.selected;

      // console.log(this.historiasCheck);

      let historias: HistoriaI[] = [];

      for (const iterator of this.historiasCheck) {
        this.setUrlImagen('assets/Firmas/MED' + iterator.md_codigo + '.bmp')
          .then((data) => {
            iterator.firma_med = data;
          })
          .catch((err) => {
            console.log(err);
          });

        historias.push(iterator);
      }

      // ordenar por fecha de dig
      historias.sort(
        (a, b) =>
          new Date(b.fecha_dig).getTime() - new Date(a.fecha_dig).getTime()
      );

      this.historiasCheck = historias;
    }
  }

  iniciarFormulario() {
    this.pacienteForm = this.fb.group({
      inputHistoria: ['', Validators.required],
    });
  }

  buscarPaciente() {
    this.setCheckFilter();
    const historia = this.pacienteForm.value.inputHistoria;
    // console.log(historia);

    this.historia = [];
    this.historiasCheck = [];
    this.selectedRow = {};

    // buscar historia por numero de historia

    this.dataSource = new MatTableDataSource<HistoriaI>([]);
    this.selection = new SelectionModel<HistoriaI>(true, []);
    this.numFolios = 0;

    this.historiasService.getHistoriasPaciente(historia).subscribe(
      (data: any) => {
        const nData = data.resultado.data[0];
        this.dataSource.data = nData;
        this.crearFiltros();
        console.log(this.dataSource.data);

        this.numFolios = this.dataSource.data.length;

        this.crearPredicado();

        const nPaciente = nData[0];
        // console.log(nPaciente);

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
          fecha_nac: this.dateStringFecha(nPaciente.fecha_nac),
          edad: this.calcularEdad(nPaciente.fecha_nac, new Date()),
          identificacion: nPaciente.identificacion,
          no_historia: nPaciente.no_historia,
          sexo: nPaciente.sexo === 'M' ? 'MASCULINO' : 'FEMENINO',
          telefono: nPaciente.telefono,
        };
        // console.log(this.paciente);
      },
      (error) => {
        console.log(error);
      }
    );

    // console.log(this.dataSource.data);

    // this.historiasService.getCodigos().subscribe((data: any) => {
    //   const nData = data.codigos[0];
    //   this.dataApi = nData;

    //   if (this.dataApi.length > 0) {
    //     console.log(this.getCodigos(this.dataApi));
    //   }
    // });
  }

  buscarPaciente2() {
    this.setCheckFilter();
    const historia = this.pacienteForm.value.inputHistoria;
    // console.log(historia);

    this.historia = [];
    this.historiasCheck = [];
    this.selectedRow = {};
    // buscar historia por numero de historia

    this.dataSource = new MatTableDataSource<HistoriaI>([]);
    this.selection = new SelectionModel<HistoriaI>(true, []);
    this.numFolios = 0;

    this.historiasService.getHistorias().subscribe((data: any) => {
      const nData = data.resultado[0];
      this.dataSource.data = nData;

      this.crearFiltros();
      console.log(this.dataSource.data);

      this.numFolios = this.dataSource.data.length;

      this.crearPredicado();

      const nPaciente = nData[0];
      // console.log(nPaciente);

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
        fecha_nac: this.dateString(new Date(nPaciente.fecha_nac)),
        edad: this.calcularEdad(nPaciente.fecha_nac, new Date()),
        identificacion: nPaciente.identificacion,
        no_historia: nPaciente.no_historia,
        sexo: nPaciente.sexo === 'M' ? 'MASCULINO' : 'FEMENINO',
        telefono: nPaciente.telefono,
      };
    });

    // console.log(this.paciente);

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
    console.log(row);

    this.historia = [];
    this.selectedRow = {};
    const separadores = this.generarSeparadores();
    // console.log(separadores);

    let myDiv = document.getElementById('specificDiv');
    if (myDiv) {
      myDiv.scrollTop = 0;
    }

    this.selectedRow = row;

    this.documento_ruta = row.direccion_archivo;

    // console.log(this.selectedRow);
    // console.log(this.selectedRow.direccion_archivo);

    // this.firma_ruta = 'assets/Firmas/MED' + this.selectedRow.md_codigo + '.bmp';

    this.setUrlImagen('assets/Firmas/MED' + this.selectedRow.md_codigo + '.bmp')
      .then((data) => {
        this.firma_ruta = data;
        this.selectedRow.firma_med = data;
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
    // console.log(this.historia);

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

    this.historiasService.postArchivos(archivo).subscribe((response) => {
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

  // Generar pdf

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

    // obj
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
      sexo: this.selectedRow.sexo === 'M' ? 'MASCULINO' : 'FEMENINO',
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

  // convertir fecha a string para visualizar
  dateString(date: Date): string {
    let d = new Date(date);

    let datestring =
      d.getDate() +
      '/' +
      (d.getMonth() + 1) +
      '/' +
      d.getFullYear() +
      ' ' +
      d.getHours() +
      ':' +
      d.getMinutes();

    return datestring;
  }

  dateStringFecha(date: Date): string {
    let d = new Date(date);

    let datestring =
      d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();

    return datestring;
  }

  // generar pdf seleccionado
  async generarPdf2() {
    let historias: HistoriaI[] = [];

    historias.push(this.selectedRow);
    this.generarPdfSeleccionados(historias);
  }

  // funcion para generar los pdfs seleccionados con checkbox
  async pdfsCheck() {
    this.generarPdfSeleccionados(this.historiasCheck);
  }

  // funcion para generar pdfs con array de historias
  async generarPdfSeleccionados(historias: HistoriaI[]) {
    const colorFondo = '#f0f0f0';
    const colorFondoFolio = '#abd4f3';
    const pdf = new PdfMakeWrapper();
    const separadores = this.generarSeparadores();
    let contador = 0;

    var d = new Date();

    // pdf.pageMargins([izquierda, arriba, derecha, abajo]);
    pdf.pageMargins([40, 50, 40, 40]);
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
          new Txt(`Fecha Impresion:      ${this.dateString(d)}`)
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
        // pdf.pageMargins([izquierda, arriba, derecha, abajo]);
        margin: [50, 15, 0, 10],
      };
    });

    // ciclo para generar pdfs con las historias seleccionadas
    for (let seleccionada of historias) {
      contador++;

      // construir pdf

      // console.log(new Date(seleccionada.fecha_dig).getTime());

      let historia: any[] = [];
      let texto1: string[] = [];
      let diagnostico = 'Sin Diagnostico';

      // crear array de historia

      if (seleccionada.texto01) {
        const txt1 = this.splitString(seleccionada.texto01, separadores);
        texto1 = txt1;
      }

      for (const iterator of texto1) {
        // console.log(this.convertirString(iterator));
        historia.push(this.convertirString(iterator));
      }

      const diag = historia.filter((h) => h.id === '1006' || h.id === '1025');

      if (diag.length > 0) {
        diagnostico = diag[0].cuerpo.split('\n')[0];
      }
      // console.log(this.diagnosticoHist);
      historia = historia.filter((h) => h.id != '-900');

      pdf.add(
        new Txt(
          `Folio No: ${seleccionada.num_orden}     \n`.trim().padEnd(250, ' ')
        )
          .fontSize(6.5)
          .alignment('left')
          .lineHeight(1.2)
          .margin([0, 5, 0, 0])
          .background(colorFondoFolio).end
      );

      pdf.add(
        new Txt(`${seleccionada.nombre_estudio}\n\n`)
          .fontSize(8.5)
          .alignment('center')
          .bold().end
      );

      // TODO: obj
      let obj = {
        nombre_paciente:
          seleccionada.ap_apellido1.trim() +
          ' ' +
          seleccionada.ap_apellido2.trim() +
          ' ' +
          seleccionada.ap_nombre1.trim() +
          ' ' +
          seleccionada.ap_nombre2.trim(),
        nombre_medico:
          seleccionada.md_apellido1.trim() +
          ' ' +
          seleccionada.md_apellido2.trim() +
          ' ' +
          seleccionada.md_nombre1.trim() +
          ' ' +
          seleccionada.md_nombre2.trim(),
        reg_medico: seleccionada.md_reg_medico,
        fecha_dig: this.dateString(seleccionada.fecha_dig),
        fecha_nac: this.dateStringFecha(seleccionada.fecha_nac),
        edad: this.calcularEdad(seleccionada.fecha_nac, seleccionada.fecha_dig),
        estado_civil: 'UNION LIBRE',
        no_historia: seleccionada.no_historia,
        identificacion: seleccionada.identificacion,
        empresa: seleccionada.empresa_nombre,
        diagnostico: diagnostico,
        sexo: seleccionada.sexo === 'M' ? 'MASCULINO' : 'FEMENINO',
        telefono: seleccionada.telefono,
        municipio:
          seleccionada.municipio == 52560
            ? 'POTOSI (N)'
            : 'FUERA DEL MUNICIPIO',
        direccion: seleccionada.direccion,
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
              return i === 0 || i === node.table.widths.length
                ? 'gray'
                : 'white';
            },
          }).end
      );

      pdf.add(new Txt('\n').end);

      for (const hist of historia) {
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
          await new Img(seleccionada.firma_med)
            .width(120)
            .margin([50, 4, 0, 0])
            .build(),
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
            new Txt('MEDICO:')
              .fontSize(6.5)
              .bold()
              .width(60)
              .margin([0, 3, 0, 0]).end,
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
          new Txt('FIRMA PACIENTE:').fontSize(6.5).bold().alignment('center')
            .end,
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
        ]).end
      );

      // TODO: salto de pagina

      if (this.historiasCheck.length - contador > 0) {
        pdf.add(new Txt('').pageBreak('after').end);
      }
    }

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
    let months = Math.floor(total_months - years * 12);

    let yearsText = ' AÑOS ';
    let monthsText = ' MESES';

    if (years === 1) {
      yearsText = ' AÑO ';
    }
    if (months === 1) {
      monthsText = ' MES';
    }

    return years + yearsText + months + monthsText;
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
