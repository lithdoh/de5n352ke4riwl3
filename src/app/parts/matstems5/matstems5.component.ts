import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { Router } from '@angular/router';
import { catchError, debounceTime, map, merge, Observable, of, startWith, switchMap } from 'rxjs';
import { Stems } from '../../models/stems.model';
import { FilterCategories, StemCheckboxFiltersComponent } from '../stem-checkbox-filters/stem-checkbox-filters.component';

@Component({
  selector: 'app-matstems5',
  templateUrl: './matstems5.component.html',
  styleUrls: ['./matstems5.component.css']
})
export class Matstems5Component {

  // api = inject(ApiService);

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

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  // Search input
  searchInput: FormControl = new FormControl('');


  //______________________________________________________________________________________________


  @ViewChild(StemCheckboxFiltersComponent) checkboxComponent!: StemCheckboxFiltersComponent;
  // @ViewChildren('sidebar') sidebar!: StemCheckboxFiltersComponent;

  categoriesLocal!: FilterCategories;

  newRemoveSelection(section: string, name: string | number | null): void {
    const formSection = this.checkboxComponent.form.get(section) as FormControl;
    const index = formSection.value.indexOf(name);

    formSection.setValue([
      ...formSection.value.slice(0, index),
      ...formSection.value.slice(index + 1),
    ]);
  };

  // These are used for writing the requestURL and also the "Filtered By:" feature
  brandsList: string[] = [];
  lengthsList: string[] = [];
  colorsList: string[] = [];
  materialsList: string[] = [];

  priceRange = this.fb.group({
    priceMin: new FormControl('', { nonNullable: true }),
    priceMax: new FormControl('', { nonNullable: true })
  });

  pricesArray: number[] = [0, 100000];

  weightRange = this.fb.group({
    weightMin: new FormControl('', { nonNullable: true }),
    weightMax: new FormControl('', { nonNullable: true })
  });

  weightsArray: number[] = [0, 100000];

  //______________________________________________________________________________________________

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private _httpClient: HttpClient,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }

  // @Output() testingProfForm: FormGroup = this.fb.group({
  //   Renthal: false,
  //   Truvativ: false,
  //   'Industry Nine': false,
  //   Campy: false,
  //   Zipp: false,
  //   Spank: false,
  // });

  updateQueryParameters() {
    this.router.navigate(
      [],
      {
        queryParams: {
          genre: ['rpg', 'prg', 'gpe'].join(',')
        },
        queryParamsHandling: 'merge'
      }
    );
  }

  ngAfterViewInit() {

    this.categoriesLocal = this.checkboxComponent.categories;

    this.cd.detectChanges(); // Run Change Detection manually to make the view update based on this changed value

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // If the user does a search, reset back to the first page.
    this.searchInput.valueChanges.pipe(debounceTime(500)).subscribe(() => this.paginator.pageIndex = 0);

    // If the user selects any filter option, reset back to the first page.
    this.checkboxComponent.form.valueChanges.subscribe(() => this.paginator.pageIndex = 0);

    // If the user enters a minimum or maximum price, reset back to the first page.
    this.priceRange.valueChanges.pipe(debounceTime(500)).subscribe(() => this.paginator.pageIndex = 0);

    // If the user enters a minimum or maximum weight, reset back to the first page.
    this.weightRange.valueChanges.pipe(debounceTime(500)).subscribe(() => this.paginator.pageIndex = 0);

    // You could make the formgroup contain all the checkboxes and the range filters and debounce both

    merge(this.sort.sortChange, this.paginator.page, this.searchInput.valueChanges.pipe(
      debounceTime(500)),
      this.checkboxComponent.form.valueChanges,
      this.priceRange.valueChanges
        .pipe(
          debounceTime(500),
          map((x) => {
            this.pricesArray = Object.values(x).map(Number);
            if (this.pricesArray[1] === 0) {
              this.pricesArray[1] = 100000;
            }
          })
        ),
      this.weightRange.valueChanges
        .pipe(
          debounceTime(500),
          map((x) => {
            console.log('x', x);
            this.weightsArray = Object.values(x).map(Number);
            if (this.weightsArray[1] === 0) {
              this.weightsArray[1] = 100000;
            }
            console.log('weightArray', this.weightsArray);
          })
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
            this.checkboxComponent.form.controls.brand.value,
            this.checkboxComponent.form.controls.clampDiameter.value,
            this.checkboxComponent.form.controls.color.value,
            this.checkboxComponent.form.controls.length.value,
            this.checkboxComponent.form.controls.material.value,
            this.checkboxComponent.form.controls.rise.value,
            this.checkboxComponent.form.controls.steererDiameter.value,
            this.pricesArray,
            this.weightsArray
          ).pipe(catchError(() => of(null)),
            map((response: any) => { this.length = response.data.aggregateStems.count; return response.data.queryStems }));
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

  log() {
    console.log('getStemsParams: ', {
      direction: this.sort.direction,
      active: this.sort.active,
      pageSize: this.paginator.pageSize,
      pageIndex: this.paginator.pageIndex,
      searchInput: this.searchInput.value!,
      brand: this.checkboxComponent.form.controls.brand.value,
      clampDiameter: this.checkboxComponent.form.controls.clampDiameter.value,
      color: this.checkboxComponent.form.controls.color.value,
      length: this.checkboxComponent.form.controls.length.value,
      material: this.checkboxComponent.form.controls.material.value,
      rise: this.checkboxComponent.form.controls.rise.value,
      steererDiameter: this.checkboxComponent.form.controls.steererDiameter.value,
      pricesArray: this.pricesArray,
      weightsArray: this.weightsArray
    })
  }

  logItem(x: any) {
    console.log(x);
  }
}

export class ExampleHttpDatabase {
  constructor(private http: HttpClient) { }

  // baseURL = 'http://localhost:8080/graphql?query='; // local
  baseURL = 'https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query='; // Dgraph Cloud

  getFilterNames(): Observable<Stems[]> {
    const requestURL = this.baseURL + `{queryStems { brand color length material rise steererDiameter weight clampDiameter price }}`;
    return this.http.get<Stems[]>(requestURL);
  }

  defaultRangeFilter: number[] = [0, 100000];

  getStems(
    order: SortDirection,
    column: string,
    pageSize: number,
    pageIndex: number,
    search: string,
    brand: string[],
    clampDiameter: string[],
    color: string[],
    length: string[],
    material: string[],
    rise: string[],
    steererDiameter: string[],
    prices: number[],
    weights: number[]
  ): Observable<Stems[]> {

    const requestURL = this.baseURL + `{ aggregateStems(filter: {name: ${search ? '{alloftext: \"' + search + '\"}' : '{}'}, 
  brand: ${(brand.length !== 0) ? '{in: [\"' + brand.join('", "') + '\"]}' : '{}'}, 
  clampDiameter: ${(clampDiameter.length !== 0) ? '{in: [' + clampDiameter + ']}' : '{}'},
  color: ${(color.length !== 0) ? '{in: [\"' + color.join('", "') + '\"]}' : '{}'}, 
  length: ${(length.length !== 0) ? '{in: [' + length + ']}' : '{}'}, 
  material: ${(material.length !== 0) ? '{in: [\"' + material.join('", "') + '\"]}' : '{}'},
  rise: ${(rise.length !== 0) ? '{in: [' + rise + ']}' : '{}'},
  steererDiameter: ${(steererDiameter.length !== 0) ? '{in: [\"' + steererDiameter.join('", "') + '\"]}' : '{}'},
  price: ${prices.toString() !== this.defaultRangeFilter.toString() ? '{between: {min: ' + prices[0] + ', max: ' + prices[1] + '}}' : '{}'}, 
  weight: ${weights.toString() !== this.defaultRangeFilter.toString() ? '{between: {min: ' + weights[0] + ', max: ' + weights[1] + '}}' : '{}'}}) { count }
   queryStems(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex * pageSize}, filter: {name: ${search ? '{alloftext: \"' + search + '\"}' : '{}'}, 
   brand: ${(brand.length !== 0) ? '{in: [\"' + brand.join('", "') + '\"]}' : '{}'}, 
  clampDiameter: ${(clampDiameter.length !== 0) ? '{in: [' + clampDiameter + ']}' : '{}'},
   length: ${(length.length !== 0) ? '{in: [' + length + ']}' : '{}'}, 
   color: ${(color.length !== 0) ? '{in: [\"' + color.join('", "') + '\"]}' : '{}'}, 
   material: ${(material.length !== 0) ? '{in: [\"' + material.join('", "') + '\"]}' : '{}'}, 
   rise: ${(rise.length !== 0) ? '{in: [' + rise + ']}' : '{}'}, 
   steererDiameter: ${(steererDiameter.length !== 0) ? '{in: [\"' + steererDiameter.join('", "') + '\"]}' : '{}'}, 
   price: ${prices.toString() !== this.defaultRangeFilter.toString() ? '{between: {min: ' + prices[0] + ', max: ' + prices[1] + '}}' : '{}'}, 
   weight: ${weights.toString() !== this.defaultRangeFilter.toString() ? '{between: {min: ' + weights[0] + ', max: ' + weights[1] + '}}' : '{}'}})
    { link clampDiameter brand color image length material name price rise steererDiameter weight } }`;
    // Why doesn't this work?
    // this.http.get('data-from-cyclery/competitive-cyclist-stems.json').subscribe(x => console.log(x));
    console.log(requestURL);
    return this.http.get<Stems[]>(requestURL);
  }
}