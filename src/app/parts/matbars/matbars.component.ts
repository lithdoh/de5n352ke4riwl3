import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  brand: string;
  model: any;
  clampDiameter: any;
  width: any;
  rise: any;
  color: string;
  material: string;
  backsweep: any;
  price: any;
  weight: any;
  where: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Descendant 35mm Carbon Riser Bar', brand: 'Truvativ', model: 'HB-DESC-RC5-B1', clampDiameter: '35mm', width: '760mm', rise: '20mm', color: 'Black', material: 'Carbon', backsweep: '7°', price: '$194', weight: '--', where: '' },
  { name: 'Descendant 35mm Carbon Riser Bar', brand: 'Truvativ', model: 'HB-DESC-RC5-B1', clampDiameter: '35mm', width: '760mm', rise: '20mm', color: 'Black', material: 'Carbon', backsweep: '7°', price: '$194', weight: '--', where: '' },
  { name: 'Descendant 35mm Carbon Riser Bar', brand: 'Truvativ', model: 'HB-DESC-RC5-B1', clampDiameter: '35mm', width: '760mm', rise: '20mm', color: 'Black', material: 'Carbon', backsweep: '7°', price: '$194', weight: '--', where: '' },
  // { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  // { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  // { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  // { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  // { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  // { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  // { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  // { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  // { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-matbars',
  templateUrl: './matbars.component.html',
  styleUrls: ['./matbars.component.css'],
})
export class MATbarsComponent implements AfterViewInit {
  displayedColumns: any[] = ['name', 'brand', 'model', 'clampDiameter', 'width', 'rise', 'color', 'material', 'backsweep', 'price', 'weight', 'where'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
