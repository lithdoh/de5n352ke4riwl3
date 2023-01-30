import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Stems } from '../models/stems.model';

export interface PeriodicElement {
  component: string;
  link: string;
  image: string;
  selection: string;
  price: string | number; // I want these properties to not display anything until they have a value set to them, i.e. I want '' to display not 0
  weight: string | number;
  priceWeight: string | number;
  where: string;
}
// What if you make some of these optional to solve the problem of not having the default...?

// Should I use a Set instead of an Array?
const ELEMENT_DATA: PeriodicElement[] = [
  {
    component: 'Bars',
    link: '/parts/matbars',
    image: '',
    selection: 'Choose Bars',
    price: '',
    weight: '',
    priceWeight: '',
    where: '',
  },
  {
    component: 'Stems',
    link: '/parts/matstems2',
    image: '',
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
export class MathomeComponent implements OnInit {
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

  // When this function is called, the table needs to refresh to show that the selection is now nothing. Can I use the Window: storage event?
  clearStem() {
    localStorage.removeItem('stem');
    window.location.reload(); // Works, but should I really be reloading the whole page?
  }

  mainView = true;
  constructor() {}
  
  ngOnInit() {
    const STEM: Stems = JSON.parse(localStorage.getItem('stem') || '{}');
    ELEMENT_DATA[1].image = STEM.image ? STEM.image : '';
    ELEMENT_DATA[1].selection = STEM.name ? STEM.name : 'Choose a Stem';
    ELEMENT_DATA[1].price = STEM.price ? STEM.price : '';
    ELEMENT_DATA[1].weight = STEM.weight ? STEM.weight : '';
    ELEMENT_DATA[1].priceWeight = (STEM.price / STEM.weight) ? (STEM.price / STEM.weight) : '';
    ELEMENT_DATA[1].where = STEM.where ? STEM.where : '';
  }

  // If there is a not stem set in local storage, display "Choose a Stem", 
  // otherwise, display the Stem's image, name, price, weight, and where properties.
  
}
