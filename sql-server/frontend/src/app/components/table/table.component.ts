import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HistoriasService } from '../../services/historias.service';
import { HistoriaI } from '../../interface/historia';

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
    this.selectedRow = row;
    console.log(this.selectedRow);

    if (this.selectedRow.texto01) {
      const txt1 = this.splitString(
        this.selectedRow.texto01,
        /1001 |1002 |1003 |1004 |1005 |1006 |1007 |1008 |1009 |1010 |1030 |1031 |1036 |1350 |1242 |1243 |1244|1245 /
      );

      this.texto1 = txt1;
    }

    if (this.selectedRow.texto02) {
      const txt2 = this.splitString(
        this.selectedRow.texto02,
        /-400 |-401 |-402 |-403 |-404 |-405 |-406 |-407 |-408 |-409 |-410 |-411 |8100 |8000 |8001 |8002 |8003 | 8004|8005 |8006 |8007 /
      );
      this.texto2 = txt2;
    }

    for (const iterator of this.texto1) {
      console.log(this.convertirString(iterator));
    }

    // console.log(this.texto1);
    // console.log(this.texto2);
  }

  splitString(string: string, separator: any = ' ') {
    const split = string.split(separator);

    return split;
  }

  convertirString(string: string) {
    const split = string.split(':');

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
    obj.codigo = obj.codigo.split(obj.orden)[1];

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
}
