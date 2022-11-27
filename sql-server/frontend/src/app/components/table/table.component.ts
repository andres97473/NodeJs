import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  size: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', size: 'big' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', size: 'big' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', size: 'big' },
  {
    position: 4,
    name: 'Beryllium',
    weight: 9.0122,
    symbol: 'Be',
    size: 'small',
  },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B', size: 'big' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', size: 'small' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', size: 'big' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', size: 'medium' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', size: 'big' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', size: 'big' },
];

/**
 * @title Angular Material data table with filtering using checkboxes.
 */

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  sizes = ['big', 'small'];
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'size'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  form = new FormGroup({
    filter: new FormControl(),
    size: new FormControl(),
  });

  isChecked(field: string, value: string) {
    const control = this.form.get(field);
    return control && control.value && control.value.indexOf(value) >= 0;
  }
  change(list: any[], field: string, value: string, isChecked: boolean) {
    const control = this.form.get(field);
    const oldValue = control ? control.value || [] : [];
    if (control) {
      if (!isChecked) {
        const newValue = oldValue.filter((x: string) => x != value);
        control.setValue(newValue.length > 0 ? newValue : null);
      } else {
        const newValue = list.filter(
          (x) => oldValue.indexOf(x) >= 0 || x == value
        );
        control.setValue(newValue);
      }
    }
  }

  ngOnInit() {
    this.dataSource.filterPredicate = (
      data: PeriodicElement,
      filter: string
    ) => {
      const obj = JSON.parse(filter);
      let find: boolean = !obj.filter && !obj.size;
      if (obj.filter) {
        const value =
          '~' +
          data.position +
          '~' +
          data.name +
          '~' +
          data.weight +
          '~' +
          data.symbol +
          '~';
        find = value.toLowerCase().indexOf(obj.filter.toLowerCase()) >= 0;
      } else find = true;

      if (obj.size) find = find && obj.size.indexOf(data.size) >= 0;
      return find;
    };

    this.form.valueChanges.subscribe((res) => {
      this.dataSource.filter = JSON.stringify(res);
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
