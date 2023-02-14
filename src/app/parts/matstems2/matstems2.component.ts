import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { Router } from '@angular/router';
import { catchError, debounceTime, map, merge, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { Stems } from '../../models/stems.model';

@Component({
  selector: 'app-matstems2',
  templateUrl: './matstems2.component.html',
  styleUrls: ['./matstems2.component.css']
})
export class Matstems2Component implements AfterViewInit {
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
  searchInput = new FormControl('');

  // Brand Filter
  profileForm = this.fb.group({
    Renthal: false,
    Truvativ: false,
    'Industry Nine': false,
    Campy: false,
    Zipp: false,
    Spank: false,
  });
  brandArray: string[] = Object.keys(this.profileForm.value).sort();

  someComplete(): boolean {
    return Object.values(this.profileForm.value).every((x) => x === false);
  }

  uncheckAll() {
    this.profileForm.setValue({
      Renthal: false,
      Truvativ: false,
      'Industry Nine': false,
      Campy: false,
      Zipp: false,
      Spank: false,
    });
    // this.profileForm.reset() doesn't work because it sets all the values to null
  }

  removeSelection(selection: string) {
    this.profileForm.get(selection)?.setValue(false);
  }

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private _httpClient: HttpClient,
    private fb: FormBuilder,
  ) {}

  testlist: string[] = [];
  
  ngAfterViewInit() {
    console.log(this.profileForm.value)
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    
    // If the user does a search, reset back to the first page.
    this.searchInput.valueChanges.subscribe(() => ((this.paginator.pageIndex = 0)));
    
    // If the user selects a filter option, reset back to the first page.
    this.profileForm.valueChanges.subscribe(() => ((this.paginator.pageIndex = 0)));

    merge(this.sort.sortChange, this.paginator.page, this.searchInput.valueChanges.pipe(
      debounceTime(500)), this.profileForm.valueChanges
      .pipe(
        map((x) => {
          this.testlist = Object.entries(x).sort()
            .filter(([_, isSelected]) => isSelected)
            .map(([key]) => key);
          return this.testlist;
          }
        )
      ))
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getStems(
            this.sort.direction,
            this.sort.active,
            this.paginator.pageSize,
            this.paginator.pageIndex,
            this.searchInput.value!,
            this.testlist
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
      .subscribe(data => this.data = data);
  }

  /** Adding products to the list: */
  addItem(stemObject: object) {

    const stemString: string = JSON.stringify(stemObject);

    /*   Should I put this in a "try...catch" block because it says 
    "Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set."? */
    localStorage.setItem('stem', stemString);

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

  logger(x: any) {
    console.log(x);
  }
}

// Sorting and Pagination
export class ExampleHttpDatabase {
  constructor(private http: HttpClient) {}
  baseURL = 'https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query=';

  // Sorting, Pagination, Filtering
  getStems(order: SortDirection, column: string, pageSize: number, pageIndex: number, search: string, brand: any[]): Observable<Stems[]> {
    // RequestURL with filtering

  // // Fixed brands
  // const requestURL = this.baseURL + `{ aggregateStem(filter: {name: {regexp: "/${search}/i"}, brand: {in: ["Renthal", "Industry Nine", "Truvativ"]}}) { count }
  //  queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize}, filter: {name: {regexp: "/${search}/i"}, brand: {in: ["Renthal", "Industry Nine", "Truvativ"]}}) 
  //   { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } }`;
  //   console.log(requestURL);
  //   // const requestURL = this.baseURL + `{ queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize}) 
  //   // { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } }`;
  //   console.log(requestURL);
  //   return this.http.get<Stems[]>(requestURL);
  // }
  
  // Request with checkbox filtering via FormArray
  const requestURL = this.baseURL + `{ aggregateStem(filter: {name: {regexp: "/${search}/i"}, brand: ${(brand.length !== 0) ? '{in: [\"' + brand.join('", "') + '\"]}' : '{}'}}) { count }
   queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize}, filter: {name: {regexp: "/${search}/i"}, brand: ${(brand.length !== 0) ? '{in: [\"' + brand.join('", "') + '\"]}' : '{}'}}) 
    { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } }`;
    console.log(requestURL);
    // const requestURL = this.baseURL + `{ queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize}) 
    // { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } }`;
    return this.http.get<Stems[]>(requestURL);
  }

  // No Filtering
  // getStems(order: SortDirection, column: string, pageSize: number, pageIndex: number): Observable<Stems[]> {

  //   const requestURL = this.baseURL + `{ queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize}) 
  //   { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } }`;

  //   return this.http.get<Stems[]>(requestURL);
  // }
}