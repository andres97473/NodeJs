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
      const splits = this.splitString(this.selectedRow.texto01, /100|124/);

      this.texto1 = splits;
    }
    console.log(this.texto1);
  }

  splitString(string: string, separator: any = ' ') {
    const split = string.split(separator);
    console.log(split.length);

    return split;
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
