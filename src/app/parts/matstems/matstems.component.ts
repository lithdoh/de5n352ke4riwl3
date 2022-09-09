import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MyServiceService } from 'src/app/my-service.service';
import { AddPartsService } from '../add-parts.service';

export interface PeriodicElement {
  image: any;
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
    image: 'https://www.sram.com/globalassets/image-hierarchy/sram-product-root-images/stems/stems/st-desc-direct-mount-35-b1/black3ql.jpg?w=800&quality=80&format=jpg',
    name: 'Descendant 35mm Direct Mount Stem',
    brand: 'Truvativ',
    model: 'ST-DESC-DM5-B1',
    barClampDiameter: '35mm',
    length: '50mm',
    rise: '0°',
    steererTubeDiameter: 'Direct Mount',
    color: 'Black',
    material: 'Al-7075',
    price: '$81',
    weight: '--',
    where: 'sram.com',
  },
  {
    image: 'https://www.sram.com/globalassets/image-hierarchy/sram-product-root-images/stems/stems/st-hussefelt-a1/2012-truvativhussefeltstem-large-en?w=800&quality=80&format=jpg',
    name: 'Hussefelt Stem',
    brand: 'Truvativ',
    model: 'ST-HUSS-A1',
    barClampDiameter: '31.8mm',
    length: '40mm',
    rise: '0°',
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
    'image',
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
    'add'
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public myService: MyServiceService,
    private router: Router,
    private AddPartsService: AddPartsService,
    ) {}

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

  onAddItem() {
    // “add” button calls function (event binding in matstems template)
    // function accesses the list of stems (stem component)
    this.AddPartsService.addItemsToHome(this.)
    // and adds a product to the build list (home component)

    // route to the page
    this.router.navigate(['/parts/chain'])
  }



}
