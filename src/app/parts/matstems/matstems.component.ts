import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  name: any;
  brand: any;
  model: any;
  barClampDiameter: any;
  length: any;
  rise: any;
  steererTubeDiameter: any;
  color: any;
  material: any;
  price: any;
  weight: any;
  where: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: 'Descendant 35mm Direct Mount Stem',
    brand: 'Truvativ',
    model: 'ST-DESC-DM5-B1',
    barClampDiameter: '35mm',
    length: '50mm',
    rise: '0 degrees',
    steererTubeDiameter: 'Direct Mount',
    color: 'Black',
    material: 'Al-7075',
    price: '$81',
    weight: '--',
    where: 'sram.com',
  },
  {
    name: 'Hussefelt Stem',
    brand: 'Truvativ',
    model: 'ST-HUSS-A1',
    barClampDiameter: '31.8mm',
    length: '40mm',
    rise: '0 degrees',
    steererTubeDiameter: '1-1/8 in',
    color: 'Blast Black',
    material: 'Al-7075',
    price: '$42',
    weight: '--',
    where: 'sram.com',
  },
];

@Component({
  selector: 'app-matstems',
  templateUrl: './matstems.component.html',
  styleUrls: ['./matstems.component.css'],
})
export class MatstemsComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'brand',
    'model',
    'barClampDiameter',
    'length',
    'rise',
    'steererTubeDiameter',
    'color',
    'material',
    'price',
    'weight',
    'where',
  ];
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
