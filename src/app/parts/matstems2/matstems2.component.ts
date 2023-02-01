import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { Router } from '@angular/router';
import { catchError, debounceTime, map, merge, Observable, of, startWith, switchMap } from 'rxjs';
import { Stems } from '../../models/stems.model';

@Component({
  selector: 'app-matstems2',
  templateUrl: './matstems2.component.html',
  styleUrls: ['./matstems2.component.css']
})
export class Matstems2Component implements OnInit, AfterViewInit {
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
    'add',
  ];
  exampleDatabase!: ExampleHttpDatabase;
  data: Stems[] = [];

  // Set defaults for matSort directive
  matSortActive: string = 'name';
  matSortDirection: SortDirection = 'asc';

  // Set defaults for matPaginator directive
  length: number = 0;
  pageSizeOptions: number[] = [10, 25, 100];
  pageSize: number = 10;
  showFirstLastButtons: boolean = true;
  isLoadingResults: boolean = true;

  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  ourInput = new FormControl('');

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private _httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);
    // Can I put these initial values in the template on the MatSort directive? Yes you can.
    // I have to set these or it won't work. Why doesn't the "StartWith" set the default?
    // this.sort.direction = 'asc';
    // this.sort.active = 'name';

    // Set length of paginator, what should the type be for x? How can I make 'length' update when search is performed?
    this.exampleDatabase.getCount().subscribe(x => this.length = x.count);
  }
  
  ngAfterViewInit() {
    // this.exampleDatabase.getStems('asc', 'name', 5, 0).subscribe(data => (this.data = data));

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    
    // If the user does a search, reset back to the first page.
    this.ourInput.valueChanges.subscribe(() => ((this.paginator.pageIndex = 0)))

    merge(this.sort.sortChange, this.paginator.page, this.ourInput.valueChanges.pipe(
      debounceTime(500)))
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getStems(
            this.sort.direction,
            this.sort.active,
            this.paginator.pageSize,
            this.paginator.pageIndex,
            this.ourInput.value!
          ).pipe(catchError(() => of(null)));
        }),
        map(data => {
          this.isLoadingResults = false;
          if (data === null) {
            return [];
          };
          return data;
        }),
      )
      .subscribe(data => this.data = data)



    // Attempt to do Sorting and Pagination the way that "Sorting Only" does it (see "Sorting Only" below)
    // merge(this.sort.sortChange, this.paginator.page)
    //   .pipe(
    //     // startWith({direction: 'asc', active: 'name', pageIndex: 0, pageSize: 5} as Sort | PageEvent),
    //     // map((value) => {
    //     //   return {direction: value?.direction, active: value?.active, pageIndex: value?.pageIndex, pageSize: value?.pageSize}
    //     // }),
    //     map(value => value as {direction?: string, active?: string, pageIndex?: number, pageSize?: number}),
    //     switchMap(({direction, active, pageIndex, pageSize}) => {
    //       this.isLoadingResults = true;
    //       return this.exampleDatabase!.getStems(
    //         direction,
    //         active,
    //         pageSize,
    //         pageIndex,
    //       ).pipe(catchError(() => of(null)));
    //     }),
    //     map(data => {
    //       this.isLoadingResults = false;
    //       if (data === null) {
    //         return [];
    //       }
    //       return data;
    //     }),
    //   )
    //   .subscribe(data => (this.data = data));

    // Sorting Only
    // this.sort.sortChange
    // .pipe(
    //   startWith({direction: 'asc', active: 'name'} as Sort),
    //   switchMap(({direction, active}) => {
    //     this.isLoadingResults = true;
    //     return this.exampleDatabase!.getStems(
    //       direction,
    //       active,
    //     ).pipe(catchError(() => of(null)));
    //   }),
    //   map(data => {
    //     this.isLoadingResults = false;
    //     if (data === null) {
    //       return [];
    //     }
    //     return data;
    //   }),
    // )
    // .subscribe(data => (this.data = data));
  }

  /** Adding products to the list: */
  addItem(stemObject: object) {
    // “add” button invokes function (event binding in matstems template)
    // function accesses the list of stems (stem component)
    
    const stemString: string = JSON.stringify(stemObject);
    /*   Should I put this in a "try...catch" block because it says 
    "Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set."? */
    localStorage.setItem('stem', stemString);

    // and adds a product to the build list (home component)

    // route to the page
    this.router.navigate(['/parts/chain']);
  }

  /* Alternatively:
  When you click the add button, the id of the item is stored, and you are redirected to the "list" page.
  On the list page, a request is sent to the database for the item with the stored id.
  That item is displayed.
  Another way
  When you click the add button, the item whose add button you clicked is stored as an object, and you are redirected to the "list" page
  That item is displayed. */

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

// Sorting and Pagination
export class ExampleHttpDatabase {
  constructor(private http: HttpClient) {}
  baseURL = 'https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query=';

  getStems(order: SortDirection, column: string, pageSize: number, pageIndex: number, filterInput: string): Observable<Stems[]> {
    // RequestURL with filtering
  const requestURL = this.baseURL + `{ queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize}, filter: {name: {regexp: "/${filterInput}/i"}}) 
    { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } }`;
    
    // const requestURL = this.baseURL + `{ queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize}) 
    // { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } }`;
    return this.http.get<Stems[]>(requestURL).pipe(map((response: any) => response.data.queryStem));
  }

  getCount() {
    const requestURL = this.baseURL + `{ aggregateStem { count }}`;
    // console.log(this.http.get<string>(requestURL).pipe(map((response: any) => response.data.aggregateStem)).subscribe(x => console.log(x)));
    return this.http.get<string>(requestURL).pipe(map((response: any) => response.data.aggregateStem));
  }
}

// Sorting only
// export class ExampleHttpDatabase {
//   constructor(private http: HttpClient) {}

//   getStems(order: SortDirection, column: string): Observable<Stems[]> {
//     const baseURL = 'https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query=';
//     const requestURL = baseURL + `{ queryStem(order: {${order}: ${column}}, first: 5, offset: 0) { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } }`;
//     console.log(requestURL);
//     return this.http.get<Stems[]>(requestURL).pipe(map((response: any) => response.data.queryStem));
//     }
// }