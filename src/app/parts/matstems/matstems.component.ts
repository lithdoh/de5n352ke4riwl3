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
  @ViewChild(PageEvent) paginator!: PageEvent;
  
  // @Output() page!: EventEmitter<PageEvent>;
  // p = this.paginator.page;
  // @Input()
  // count: number = 0;

  // @Output()
  // change: EventEmitter < number > = new EventEmitter < number > ();

  // show() {
  //   console.log("abc");
  //   this.count++;
  //   this.change.emit(this.count);
  //   console.log(this.count);
  // }

  // incrementCounter() {
  //   this.count++;
  //   this.change.emit(this.count)
  // }

  // decrementCounter() {
  //   this.count--;
  //   this.change.emit(this.count)
  // }

  getServerData($event: PageEvent) {
    console.log($event);
  }

  logger($event: any) {
    console.log($event);
  }

  dataSource!: StemsDataSource;

  isLoading = false;
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  
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
    // this.stemsService.getStems('asc').subscribe(data => {
    //   this.testDataSource.data = data;
    //   this.testDataSource.sort = this.sort;
    // })
    this.dataSource = new StemsDataSource(this.stemsService, this.sort, this.paginator);
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




// export class StemsDataSource extends DataSource<any> {
//   constructor(private stemsService: StemsService,
//     private sort: MatSort,
//     private paginator: MatPaginator) {
//       super();
//     }
//     connect(): Observable<Stems[]> {
//       // here is the issue: I can manually write 'asc' or 'desc' and it works, but the sort direction needs to be changed when the
//       // arrows on the table headers are clicked
//       // return this.stemsService.getStems('asc', 'price');
    
//       return this.sort.sortChange.pipe(
//         startWith({direction: 'asc', active: 'name'}),
//         switchMap(({direction, active}) => this.stemsService.getStems(direction, active)),
//         )   
//       }
//       disconnect() {}
// }
export class StemsDataSource extends DataSource<any> {
  constructor(private stemsService: StemsService,
    private sort: MatSort,
    private paginator: PageEvent) {
      super();
    }
    connect(): Observable<Stems[]> {
      // here is the issue: I can manually write 'asc' or 'desc' and it works, but the sort direction needs to be changed when the
      // arrows on the table headers are clicked
      // return this.stemsService.getStems('asc', 'price');
    
      return this.paginator.pageIndex.pipe(
        startWith({pageIndex: 0, pageSize: 50}),
        switchMap(({pageIndex, pageSize}) => this.stemsService.getStems(pageIndex, pageSize)),
        )   
      }
      disconnect() {}
}


// export class StemsDataSource extends DataSource<any> {
//   constructor(private stemsService: StemsService,
//               private sort: MatSort,
//               private paginator: MatPaginator) {
//     super();
//   }
//   connect(): Observable<Stems[]> {
//     // here is the issue: I can manually write 'asc' or 'desc' and it works, but the sort direction needs to be changed when the
//     // arrows on the table headers are clicked
//     // return this.stemsService.getStems('asc', 'price');
//     let direction: string;

//     return merge(this.sort.sortChange, this.paginator.page).pipe(
//       startWith({direction: 'asc', active: 'name', pageIndex: 0, pageSize: 50}),
//       switchMap(({direction, active, pageIndex, pageSize}) => this.stemsService.getStems(direction, active, pageIndex, pageSize)),
//     )
//   }
//   disconnect() {}
// }