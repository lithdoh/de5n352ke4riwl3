import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Stems } from '../models/stems.model';
import { Router } from '@angular/router';

export interface PeriodicElement {
  component: string;
  routeLink: string;
  image: string;
  selection: string;
  price: string | number; // These properties should not display anything until they have a value set to them, i.e. '' should be displayed, not 0.
  weight: string | number;
  priceWeight: string | number;
  link: string;
}
// What if you make some of these optional to solve the problem of not having the default...?

// Should I use a Set instead of an Array?
let ELEMENT_DATA: PeriodicElement[] = [
  {
    component: 'Bars',
    routeLink: '/parts/matbars',
    image: '',
    selection: 'Choose Bars',
    price: '',
    weight: '',
    priceWeight: '',
    link: '',
  },
  {
    component: 'Stems',
    routeLink: '/parts/matstems2',
    image: '',
    selection: 'Choose a Stem',
    price: '',
    weight: '',
    priceWeight: '',
    link: '',
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
    // 'priceWeight',
    'add',
    'remove',
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  // When this function is called, the table needs to refresh to show that the selection is now nothing. Can I use the Window: storage event?
  clearStem() {
    localStorage.removeItem('stem');
    // window.location.reload(); // Works, but should I really be reloading the whole page?
    this.router.navigate([this.router.url]);
  }

  mainView = true;
  constructor(private router: Router) {}

  // Not all of the properties from the stem in localStorage are used, so Stems_Data[1] cannot be set to the whole object
  ngOnInit() {
    const STEM: Stems = JSON.parse(localStorage.getItem('stem') || '{}');
    const {image, name, price, weight, link} = STEM;

    ELEMENT_DATA[1].image = image ? image : '';
    ELEMENT_DATA[1].selection = name ? name : 'Choose a Stem';
    ELEMENT_DATA[1].price = price ? price : '';
    ELEMENT_DATA[1].weight = weight ? weight : '';
    ELEMENT_DATA[1].priceWeight = (price / weight) ? price / weight : '';
    ELEMENT_DATA[1].link = link;
    console.log(ELEMENT_DATA[1].link);
  }

/*   If there is a not stem set in local storage, display "Choose a Stem" in the
  selection column and nothing in the price, weight, price/weight or where columns */
  // otherwise, display the Stem's image, name, price, weight, and where properties.

}
