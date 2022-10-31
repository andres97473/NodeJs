import {
  Component,
  AfterViewInit,
  ViewChild,
  OnInit,
  Input,
} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss'],
})
export class TablaComponent implements OnInit, AfterViewInit {
  @Input('datatable') datatable!: any[];
  @Input('displayedColumns') displayedColumns!: any[];
  @Input('columnas') columnas!: any[];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource: any;

  constructor(private _liveAnnouncer: LiveAnnouncer) {}
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.datatable);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
