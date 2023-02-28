import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Output, ViewChild } from '@angular/core';
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
    'length',
    'rise',
    'clampDiameter',
    'steererDiameter',
    'color',
    'material',
    'weight',
    'price',
    'add',
  ];
  exampleDatabase: ExampleHttpDatabase = new ExampleHttpDatabase(this._httpClient);
  data: Stems[] = [];

  // Set defaults for matSort directive
  matSortActive: string = 'name';
  matSortDirection: SortDirection = 'asc';

  // Set defaults for matPaginator directive
  length: number = 0;
  pageSizeOptions: number[] = [25, 50, 100];
  pageSize: number = 25;
  showFirstLastButtons: boolean = true;
  isLoadingResults: boolean = true;

  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  // Search input
  searchInput = new FormControl('');


//______________________________________________________________________________________________

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
    // this.profileForm.reset() doesn't work because it sets all the values to null, how to set the defaults to false?
  }

  removeSelection(selection: string) {
    this.profileForm.get(selection)?.setValue(false);
  }

//______________________________________________________________________________________________

  // Color Filter begin -- VIOLATES DRY
  colorProfileForm = this.fb.group({
    Red: false,
    Blue: false,
    Lime: false,
    "Matte with stealth decals": false,
    "Blast Black": false,
  });
  colorArray: string[] = Object.keys(this.colorProfileForm.value).sort();

  colorSomeComplete(): boolean {
    return Object.values(this.colorProfileForm.value).every((x) => x === false);
  }

  colorUncheckAll() {
    this.colorProfileForm.setValue({
      Red: false,
      Blue: false,
      Lime: false,
      "Matte with stealth decals": false,
      "Blast Black": false,
    });
  }

  colorRemoveSelection(selection: string) {
    this.colorProfileForm.get(selection)?.setValue(false);
  }
  // Color Filter end

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private _httpClient: HttpClient,
    private fb: FormBuilder,
  ) {}

  testlist: string[] = [];
  colorTestlist: string[] = []; // VIOLATES DRY

  @Output() testingProfForm: FormGroup = this.fb.group({
    Renthal: false,
    Truvativ: false,
    'Industry Nine': false,
    Campy: false,
    Zipp: false,
    Spank: false,
  });

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // If the user does a search, reset back to the first page.
    this.searchInput.valueChanges.subscribe(() => ((this.paginator.pageIndex = 0)));

    // If the user selects a BRAND filter option, reset back to the first page.
    this.profileForm.valueChanges.subscribe(() => ((this.paginator.pageIndex = 0)));

    // If the user selects a COLOR filter option, reset back to the first page.
    this.colorProfileForm.valueChanges.subscribe(() => ((this.paginator.pageIndex = 0))); // VIOLATES DRY

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
      ), this.colorProfileForm.valueChanges // VIOLATES DRY? Not sure if it would be possible to not repeat this
      .pipe(
        map((x) => {
          this.colorTestlist = Object.entries(x).sort()
            .filter(([_, isSelected]) => isSelected)
            .map(([key]) => key);
          return this.colorTestlist;
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
            this.testlist,
            this.colorTestlist
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
  addItem(stemObject: Stems) {
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
  // This would allow you to use the edges of the database to make the compatibility features,
  // because without using the ID you just have the data from the item and not the actual item... right?


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

  baseURL = 'http://localhost:8080/graphql?query='; // local
  // baseURL = 'https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query='; // Dgraph Cloud

  // Sorting, Pagination, Filtering
  getStems(order: SortDirection, column: string, pageSize: number, pageIndex: number, search: string, brand: any[], color: any[]): Observable<Stems[]> {
    // RequestURL with filtering

  // // Fixed brands
  // const requestURL = this.baseURL + `{ aggregateStem(filter: {name: {regexp: "/${search}/i"}, brand: {in: ["Renthal", "Industry Nine", "Truvativ"]}}) { count }
  //  queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize}, filter: {name: {regexp: "/${search}/i"}, brand: {in: ["Renthal", "Industry Nine", "Truvativ"]}})
  //   { link clampDiameter brand color image length material name price rise steererDiameter weight } }`;
  //   console.log(requestURL);
  //   // const requestURL = this.baseURL + `{ queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize})
  //   // { link clampDiameter brand color image length material name price rise steererDiameter weight } }`;
  //   console.log(requestURL);
  //   return this.http.get<Stems[]>(requestURL);
  // }

  // Request with checkbox filtering via FormArray
  const requestURL = this.baseURL + `{ aggregateStem(filter: {name: {regexp: "/${search}/i"}, brand: ${(brand.length !== 0) ? '{in: [\"' + brand.join('", "') + '\"]}' : '{}'}, color: ${(color.length !== 0) ? '{in: [\"' + color.join('", "') + '\"]}' : '{}'}}) { count }
   queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize}, filter: {name: {regexp: "/${search}/i"}, brand: ${(brand.length !== 0) ? '{in: [\"' + brand.join('", "') + '\"]}' : '{}'}, color: ${(color.length !== 0) ? '{in: [\"' + color.join('", "') + '\"]}' : '{}'}})
    { link clampDiameter brand color image length material name price rise steererDiameter weight } }`;
    console.log(requestURL);
    // const requestURL = this.baseURL + `{ queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize})
    // { link clampDiameter brand color image length material name price rise steererDiameter weight } }`;
    return this.http.get<Stems[]>(requestURL);
  }

  // No Filtering
  // getStems(order: SortDirection, column: string, pageSize: number, pageIndex: number): Observable<Stems[]> {

  //   const requestURL = this.baseURL + `{ queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize})
  //   { link clampDiameter brand color image length material name price rise steererDiameter weight } }`;

  //   return this.http.get<Stems[]>(requestURL);
  // }
}
