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

  brandsDefault = {
    Renthal: false,
    Truvativ: false,
    'Industry Nine': false,
    Campy: false,
    Zipp: false,
    Spank: false,
  };

  colorsDefault = {
    Red: false,
    Blue: false,
    Lime: false,
    'Matte with stealth decals': false,
    'Blast Black': false,
  };

  materialsDefault = {
    Titanium: false,
    Steel: false,
    'Al-7075': false,
    'Blue Steel': false,
    Copper: false,
    '7075 Machined Aluminum': false,
  };

  // Using Form Builder
  profileForm = this.fb.group({
    brands: this.fb.group(this.brandsDefault),
    colors: this.fb.group(this.colorsDefault),
    materials: this.fb.group(this.materialsDefault),
  });


  someComplete(section: string): boolean {
    switch (section) {
      case 'brands':
        return Object.values(this.profileForm.controls.brands.value).every(
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
      case 'colors':
        this.profileForm.controls.colors.get(selection)?.setValue(false);
        break;
      case 'materials':
        this.profileForm.controls.materials.get(selection)?.setValue(false);
    }
  }

  brandsList: string[] = [];
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
            this.colorsList,
            this.materialsList
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
  getStems(order: SortDirection, column: string, pageSize: number, pageIndex: number, search: string, brand: any[], color: any[], material: any[]): Observable<Stems[]> {
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
  const requestURL = this.baseURL + `{ aggregateStem(filter: {name: {regexp: "/${search}/i"}, brand: ${(brand.length !== 0) ? '{in: [\"' + brand.join('", "') + '\"]}' : '{}'}, color: ${(color.length !== 0) ? '{in: [\"' + color.join('", "') + '\"]}' : '{}'}, material: ${(material.length !== 0) ? '{in: [\"' + material.join('", "') + '\"]}' : '{}'}}) { count }
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
