import {LiveAnnouncer} from '@angular/cdk/a11y';
import {Component, EventEmitter, OnInit, Input, Output, ViewChild} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {merge, Observable, startWith, switchMap} from 'rxjs';
import {StemsService} from '../../services/stems.service';
import {Stems} from "../../models/stems.model";
import {DataSource} from "@angular/cdk/collections";
import { MatPaginator, MatPaginatorDefaultOptions, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-matstems',
  templateUrl: './matstems.component.html',
  styleUrls: ['./matstems.component.css'],
})
export class MatstemsComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  dataSource!: StemsDataSource;

  isLoading = false;
  totalRows = 27; // How can I make total rows come from the database "count"?
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  showFirstLastButtons = true;
  
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
  // From talk with Steve
  // @Output() id: EventEmitter<any> = new EventEmitter();

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private stemsService: StemsService
  ) {}

  ngOnInit(): void {
    this.dataSource = new StemsDataSource(this.stemsService, this.sort);
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

  /** Adding products to the list: */
  onAddItem() {
    // “add” button invokes function (event binding in matstems template)
    // function accesses the list of stems (stem component)

    /* From talk with Steve
     this.id.emit(id);
    */

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



// Sorting only
export class StemsDataSource extends DataSource<any> {
  constructor(private stemsService: StemsService,
    private sort: MatSort) {
      super();
    }
    connect(): Observable<Stems[]> {
      return this.sort.sortChange.pipe(
      startWith({direction: 'asc', active: 'name'} as Sort),
      switchMap(({direction, active}) => this.stemsService.getStems(direction, active)),
      )   
    }
    disconnect() {}
}

// Pagination only
// export class StemsDataSource extends DataSource<any> {
//   constructor(
//     private stemsService: StemsService,
//     private paginator: MatPaginator
//     ) {
//       super();
//     }
//     connect(): Observable<Stems[]> {  
//       return this.paginator.page.pipe(
//         startWith({pageSize: 5, pageIndex: 0} as PageEvent),
//         switchMap(({pageSize, pageIndex}) => this.stemsService.getStems(pageSize, pageIndex))
//         )
//       }
//       disconnect() {}
// }

// Sorting and Pagination
// export class StemsDataSource extends DataSource<any> {
//   constructor(private stemsService: StemsService,
//               private sort: MatSort,
//               private paginator: MatPaginator) {
//     super();
//   }
//   connect(): Observable<Stems[]> {
//     return merge(this.sort.sortChange, this.paginator.page).pipe(
//       startWith({direction: 'asc', active: 'name'} as Sort, {pageIndex: 0, pageSize: 50} as PageEvent),
//       switchMap(({direction, active, pageIndex, pageSize}) => this.stemsService.getStems(direction, active, pageIndex, pageSize)),
//     )
//   }
//   disconnect() {}
// }
