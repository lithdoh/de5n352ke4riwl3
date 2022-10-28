import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DataSource } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Stems } from 'src/app/models/stems.model';
import { StemsService } from 'src/app/services/stems.service';

@Component({
  selector: 'app-matstems',
  templateUrl: './matstems.component.html',
  styleUrls: ['./matstems.component.css'],
})
export class MatstemsComponent implements OnInit {
  dataSource = new StemsDataSource(this.stemsService);

  displayedColumns: string[] = [
    // 'id',
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
    'add',
  ];
  
  @Output() id: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private stemsService: StemsService
  ) {}

  ngOnInit(): void {}


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

  // Adding products to the list:
  onAddItem(id: string) {
    // “add” button invokes function (event binding in matstems template)
    // function accesses the list of stems (stem component)
    this.id.emit(id);
    // and adds a product to the build list (home component)

    // route to the page
    this.router.navigate(['/parts/chain']);
  }

  // Alternatively:
  // When you click the add button, the id of the item is stored, and you are redirected to the "list" page.
  // On the list page, a request is sent to the database for the item with the stored id.
  // That item is displayed.
  // Another way
  // When you click the add button, the item whose add button you clicked is stored as an object, and you are redirected to the "list" page
  // That item is displayed.
}

export class StemsDataSource extends DataSource<any> {
  constructor(private stemsService: StemsService) {
    super();
  }
  connect(): Observable<Stems[]> {
    return this.stemsService.getStems();
  }
  disconnect() {}
}
