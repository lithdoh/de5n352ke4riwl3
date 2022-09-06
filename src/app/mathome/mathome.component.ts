import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
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
  { component: 'Bars', link: 'parts/matbars', selection: 'Choose Bars', price: '', weight: '', priceWeight: '', where: '' },
  { component: 'Stems', link: 'parts/matstems', selection: 'Choose a Stem', price: '', weight: '', priceWeight: '', where: '' },
];

@Component({
  selector: 'app-mathome',
  templateUrl: './mathome.component.html',
  styleUrls: ['./mathome.component.css']
})
export class MathomeComponent implements AfterViewInit {
  displayedColumns: string[] = ['component', 'selection', 'price', 'weight', 'priceWeight', 'where', 'add', 'remove'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private _liveAnnouncer: LiveAnnouncer) { }

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
