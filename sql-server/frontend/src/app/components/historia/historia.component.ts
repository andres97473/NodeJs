import { Component, OnInit } from '@angular/core';
import { HistoriasService } from '../../services/historias.service';

@Component({
  selector: 'app-historia',
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.scss'],
})
export class HistoriaComponent implements OnInit {
  historias: any[] = [];

  constructor(private historiasService: HistoriasService) {}

  ngOnInit(): void {
    this.historiasService.getHistorias().subscribe((data: any) => {
      const nData = data.resultado[0];
      console.log(nData);
      this.historias = nData;
    });
  }
}
