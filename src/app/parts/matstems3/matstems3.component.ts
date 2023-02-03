import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { Router } from '@angular/router';
import { catchError, debounceTime, map, merge, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { Stems } from '../../models/stems.model';
import { Apollo, gql } from 'apollo-angular'

@Component({
  selector: 'app-matstems3',
  templateUrl: './matstems3.component.html',
  styleUrls: ['./matstems3.component.css']
})
export class Matstems3Component implements AfterViewInit {
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
  exampleDatabase: ExampleHttpDatabase = new ExampleHttpDatabase(this._httpClient);
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

  // Search input
  ourInput = new FormControl('');

  // Sidenav Filters
  brands = this._formBuilder.group({
    renthal: false,
    industry_nine: false,
    truvativ: false,
  });

  testingBrands: string[] = [
    "Renthal",
    "Truvativ"
  ]

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private _httpClient: HttpClient,
    private _formBuilder: FormBuilder,
  ) {}
  
  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    
    // If the user does a search, reset back to the first page.
    this.ourInput.valueChanges.subscribe(() => ((this.paginator.pageIndex = 0)));

    this.brands.valueChanges.pipe(
      tap(value => console.log(value))
    ).subscribe();

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
            this.ourInput.value!,
            this.testingBrands
          ).pipe(catchError(() => of(null)),
          map((response: any) => {this.length = response.data.aggregateStem.count; return response.data.queryStem}));
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

  // Sorting, Pagination, Filtering
  getStems(order: SortDirection, column: string, pageSize: number, pageIndex: number, search: string, brand: string[]): Observable<Stems[]> {
    // RequestURL with filtering
  const requestURL = this.baseURL + `{ aggregateStem(filter: {name: {regexp: "/${search}/i"}, brand: {in: ["${brand[0]}", "${brand[1]}"]}}) { count }
   queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize}, filter: {name: {regexp: "/${search}/i"}, brand: {in: ["${brand[0]}", "${brand[1]}"]}}) 
    { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } }`;
    console.log(requestURL);
  //   // const requestURL = this.baseURL + `{ queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize}) 
  //   // { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } }`;
  //   console.log(requestURL);
    return this.http.get<Stems[]>(requestURL);
  }
}