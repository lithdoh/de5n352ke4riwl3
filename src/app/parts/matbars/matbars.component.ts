import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  image: any;
  name: string;
  brand: string;
  model: any;
  clamp: any;
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
  {
    image:
      'https://www.sram.com/globalassets/image-hierarchy/sram-product-root-images/handlebars/handlebars---riser/hb-desc-riser-35-a1/blackfrontwhor.jpg?w=1000&quality=80&format=jpg',
    name: 'Descendant 35mm Carbon Riser Bar',
    brand: 'Truvativ',
    model: 'HB-DESC-RC5-B1',
    clamp: '35mm',
    width: '760mm',
    rise: '20mm',
    color: 'Black',
    material: 'Carbon',
    backsweep: '7°',
    price: '$194',
    weight: '--',
    where: 'Sram.com',
  },
  {
    image:
      'https://www.sram.com/globalassets/image-hierarchy/sram-product-root-images/handlebars/handlebars---flat/hb-atms-flat-carbon-318-a1/productassets_hb-atms-fc1-a1_fg/hbatmcrbnf318a1cfronth.png?w=1000&quality=80&format=jpg',
    name: 'Descendant 35mm Carbon Riser Bar',
    brand: 'Truvativ',
    model: 'HB-DESC-RC5-B1',
    clamp: '35mm',
    width: '720mm',
    rise: '20mm',
    color: 'Black',
    material: 'Carbon',
    backsweep: '7°',
    price: '$194',
    weight: '--',
    where: '',
  },
];

/**
 * @title Table with sorting
 */
@Component({
  selector: 'table-sorting-example',
  styleUrls: ['./matbars.component.css'],
  templateUrl: './matbars.component.html',
})
export class MATbarsComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'image',
    'name',
    'brand',
    'model',
    'clamp',
    'width',
    'rise',
    'color',
    'material',
    'backsweep',
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

/**  Copyright 2022 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */
