import { AfterViewInit, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  component: string;
  link: string;
  selection: string;
  price: string;
  weight: string;
  priceWeight: string;
  where: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    component: 'Bars',
    link: '/parts/matbars',
    selection: 'Choose Bars',
    price: '',
    weight: '',
    priceWeight: '',
    where: '',
  },
  {
    component: 'Stems',
    link: '/parts/matstems',
    selection: 'Choose a Stem',
    price: '',
    weight: '',
    priceWeight: '',
    where: '',
  },
];

@Component({
  selector: 'app-mathome',
  templateUrl: './mathome.component.html',
  styleUrls: ['./mathome.component.css'],
})
export class MathomeComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'component',
    'selection',
    'price',
    'weight',
    'priceWeight',
    'where',
    'add',
    'remove',
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  
  mainView = true;
  constructor() {}
  
  ngAfterViewInit() {}
  
}
