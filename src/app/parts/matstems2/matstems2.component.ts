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
  searchInput: FormControl = new FormControl('');


//______________________________________________________________________________________________

  brandsDefault = {
    "Deity Components": false,
    "Industry Nine": false,
    "FSA": false,
    "Chromag": false,
    "OneUp Components": false,
    "Renthal": false,
    "PNW Components": false,
    "Race Face": false,
  };

  lengthsDefault = {
    30: false,
    32: false,
    35: false,
    40: false,
    50: false,
    60: false,
    65: false,
  };

  colorsDefault = {
    "Purple": false,
    "Lime": false,
    "Red": false,
    "Black": false,
    "Ano Orange": false,
    "Blue": false,
  };

  materialsDefault = {
    "6061 T6 aluminum": false,
    "[stem] 7075 aluminum, [bolts] 316 stainless steel": false,
    "CNC machined 6061 T6 aluminum": false,
    "2014-series aluminum": false,
    "[body] carbon fiber, [face plate] aluminum, [hardware] titanium": false,
    "EA70 aluminum": false,
    "aluminum": false
  };

  // Using Form Builder
  profileForm = this.fb.group({
    brands: this.fb.group(this.brandsDefault),
    lengths: this.fb.group(this.lengthsDefault),
    colors: this.fb.group(this.colorsDefault),
    materials: this.fb.group(this.materialsDefault),
  });

  someComplete(section: string): boolean {
    switch (section) {
      case 'brands':
        return Object.values(this.profileForm.controls.brands.value).every(
          (x) => x === false
        );
      case 'lengths':
        return Object.values(this.profileForm.controls.lengths.value).every(
          (x) => x === false
        );
      case 'colors':
        return Object.values(this.profileForm.controls.colors.value).every(
          (x) => x === false
        );
      case 'materials':
        return Object.values(this.profileForm.controls.materials.value).every(
          (x) => x === false
        );
      default:
        return true;
    }
  }

  uncheckAll(section: string) {
    switch (section) {
      case 'brands':
        this.profileForm.controls.brands.setValue(this.brandsDefault);
        break;
      case 'lengths':
        this.profileForm.controls.lengths.setValue(this.lengthsDefault);
        break;
      case 'colors':
        this.profileForm.controls.colors.setValue(this.colorsDefault);
        break;
      case 'materials':
        this.profileForm.controls.materials.setValue(this.materialsDefault);
    }
  }

  removeSelection(section: string, selection: string) {
    switch (section) {
      case 'brands':
        this.profileForm.controls.brands.get(selection)?.setValue(false);
        break;
      case 'lengths':
        this.profileForm.controls.lengths.get(selection)?.setValue(false);
        break;
      case 'colors':
        this.profileForm.controls.colors.get(selection)?.setValue(false);
        break;
      case 'materials':
        this.profileForm.controls.materials.get(selection)?.setValue(false);
    }
  }

  brandsList: string[] = [];
  lengthsList: string[] = [];
  colorsList: string[] = [];
  materialsList: string[] = [];

//______________________________________________________________________________________________

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private _httpClient: HttpClient,
    private fb: FormBuilder,
  ) {}

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

    merge(this.sort.sortChange, this.paginator.page, this.searchInput.valueChanges.pipe(
      debounceTime(500)), 
      this.profileForm.controls.brands.valueChanges
      .pipe(
        map((x) => {
          this.brandsList = Object.entries(x).sort()
            .filter(([_, isSelected]) => isSelected)
            .map(([key]) => key);
          return this.brandsList;
          }
        )
      ), 
      this.profileForm.controls.lengths.valueChanges
      .pipe(
        map((x) => {
          this.lengthsList = Object.entries(x).sort()
            .filter(([_, isSelected]) => isSelected)
            .map(([key]) => key);
          return this.lengthsList;
          }
        )
      ), 
      this.profileForm.controls.colors.valueChanges
      .pipe(
        map((x) => {
          this.colorsList = Object.entries(x).sort()
            .filter(([_, isSelected]) => isSelected)
            .map(([key]) => key);
          return this.colorsList;
          }
        )
      ),
      this.profileForm.controls.materials.valueChanges
      .pipe(
        map((x) => {
          this.materialsList = Object.entries(x).sort()
            .filter(([_, isSelected]) => isSelected)
            .map(([key]) => key);
          return this.materialsList;
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
            this.brandsList,
            this.lengthsList,
            this.colorsList,
            this.materialsList
          ).pipe(catchError(() => of(null)),
          map((response: any) => {this.length = response.data.aggregateStems.count; return response.data.queryStems}));
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

  // baseURL = 'http://localhost:8080/graphql?query='; // local
  baseURL = 'https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query='; // Dgraph Cloud

  getFilterNames(): Observable<Stems[]> {
    const requestURL = this.baseURL + `{queryStems { brand color length material rise steererDiameter weight clampDiameter price }}`;
    return this.http.get<Stems[]>(requestURL);
  }

  // Sorting, Pagination, Filtering
  getStems(order: SortDirection, column: string, pageSize: number, pageIndex: number, search: string, brand: any[], length: any[], color: any[], material: any[]): Observable<Stems[]> {

  const requestURL = this.baseURL + `{ aggregateStems(filter: {name: {regexp: "/${search}/i"}, brand: ${(brand.length !== 0) ? '{in: [\"' + brand.join('", "') + '\"]}' : '{}'}, 
  length: ${(length.length !== 0) ? '{in: [' + length + ']}' : '{}'}, color: ${(color.length !== 0) ? '{in: [\"' + color.join('", "') + '\"]}' : '{}'}, 
  material: ${(material.length !== 0) ? '{in: [\"' + material.join('", "') + '\"]}' : '{}'}}) { count }
   queryStems(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize}, filter: {name: {regexp: "/${search}/i"}, 
   brand: ${(brand.length !== 0) ? '{in: [\"' + brand.join('", "') + '\"]}' : '{}'}, length: ${(length.length !== 0) ? '{in: [' + length + ']}' : '{}'}, 
   color: ${(color.length !== 0) ? '{in: [\"' + color.join('", "') + '\"]}' : '{}'}, material: ${(material.length !== 0) ? '{in: [\"' + material.join('", "') + '\"]}' : '{}'}})
    { link clampDiameter brand color image length material name price rise steererDiameter weight } }`;
    // Why doesn't this work?
    // this.http.get('data-from-cyclery/competitive-cyclist-stems.json').subscribe(x => console.log(x));
    return this.http.get<Stems[]>(requestURL);
  }
}
