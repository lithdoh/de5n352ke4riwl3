import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { Observable, catchError, debounceTime, map, merge, of, startWith, switchMap, tap } from 'rxjs';
import { Stems } from '../../models/stems.model';
import { FilterCategories, StemCheckboxFiltersComponent } from '../stem-checkbox-filters/stem-checkbox-filters.component';
import { RangeFiltersComponent } from '../range-filters/range-filters/range-filters.component';
import { RangeFilter } from 'src/app/models/range-filter';

interface StemCheckboxForm {
  brand: string[];
  length: number[];
  rise: number[];
  clampDiameter: number[];
  steererDiameter: string[];
  color: string[];
  material: string[];
}

@Component({
  selector: 'app-matstems5',
  templateUrl: './matstems5.component.html',
  styleUrls: ['./matstems5.component.css']
})
export class Matstems5Component implements AfterViewInit, OnInit {

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
  pageIndex: number = 0;
  showFirstLastButtons: boolean = true;
  isLoadingResults: boolean = true;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  // Search input
  searchInput: FormControl = new FormControl('', { nonNullable: true });


  //______________________________________________________________________________________________


  @ViewChild(StemCheckboxFiltersComponent) checkboxComponent!: StemCheckboxFiltersComponent;
  // @ViewChildren('sidebar') sidebar!: StemCheckboxFiltersComponent;

  @ViewChild(RangeFiltersComponent) rangeComponent!: RangeFiltersComponent;


  categoriesLocal!: FilterCategories;

  newRemoveSelection(section: string, name: string | number | null): void {
    const formSection = this.checkboxComponent.form.get(section) as FormControl;
    const index = formSection.value.indexOf(name);

    formSection.setValue([
      ...formSection.value.slice(0, index),
      ...formSection.value.slice(index + 1),
    ]);
  };

  // defaultRangeFilter: number[] = [0, 100000];

  // pricesArray: number[] = [0, 100000];
  // weightsArray: number[] = [0, 100000];

  //______________________________________________________________________________________________

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private _httpClient: HttpClient,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  // updateQueryParameters() {
  //   this.router.navigate(
  //     [],
  //     {
  //       queryParams: {
  //         genre: ['rpg', 'prg', 'gpe'].join(',')
  //       },
  //       queryParamsHandling: 'merge'
  //     }
  //   );
  // }
  updateQueryParameters() {
    const checkboxFormControls = this.checkboxComponent.form.controls;
    const rangeFormControls = this.rangeComponent.form.controls;
    this.router.navigate(
      [],
      {
        queryParams: {
          active: this.sort.active !== "name" || this.sort.direction !== "asc" ? this.sort.active : null,
          direction: this.sort.active !== "name" || this.sort.direction !== "asc" ? this.sort.direction : null,
          pageSize: this.paginator.pageSize !== 25 ? this.paginator.pageSize : null,
          pageIndex: this.paginator.pageIndex !== 0 ? this.paginator.pageIndex : null,
          searchInput: this.searchInput.value !== "" ? this.searchInput.value : null,
          brand: checkboxFormControls['brand'].value.length !== 0 ? checkboxFormControls['brand'].value.join(',') : null,
          clampDiameter: checkboxFormControls['clampDiameter'].value.length !== 0 ? checkboxFormControls['clampDiameter'].value.join(',') : null,
          color: checkboxFormControls['color'].value.length !== 0 ? checkboxFormControls['color'].value.join(',') : null,
          length: checkboxFormControls['length'].value.length !== 0 ? checkboxFormControls['length'].value.join(',') : null,
          material: checkboxFormControls['material'].value.length !== 0 ? checkboxFormControls['material'].value.join(',') : null,
          rise: checkboxFormControls['rise'].value.length !== 0 ? checkboxFormControls['rise'].value.join(',') : null,
          steererDiameter: checkboxFormControls['steererDiameter'].value.length !== 0 ? checkboxFormControls['steererDiameter'].value.join(',') : null,
          priceMin: rangeFormControls['priceRange'].controls.min.value !== '' ? rangeFormControls['priceRange'].controls.min.value : null,
          priceMax: rangeFormControls['priceRange'].controls.max.value !== '' ? rangeFormControls['priceRange'].controls.max.value : null,
          weightMin: rangeFormControls['weightRange'].controls.min.value !== '' ? rangeFormControls['weightRange'].controls.min.value : null,
          weightMax: rangeFormControls['weightRange'].controls.max.value !== '' ? rangeFormControls['weightRange'].controls.max.value : null,
        },
        queryParamsHandling: 'merge',
      }
    );

  }

  // getQueryParameters() {
  //   // See UrlTree in angular.io for an example
  //   const tree: UrlTree = this.router.parseUrl(window.location.search);
  //   const q = tree.queryParams;
  //   console.log('queryParams: ', q);
  // }

  ngOnInit() {

  }

  ngAfterViewInit() {

    // Subscribe to changes in route query params
    this.route.queryParams.subscribe(params => {
      this.matSortActive = params['active'] || 'name';
      this.matSortDirection = params['direction'] || 'asc';
      this.pageSize = params['pageSize'] || 25;
      this.pageIndex = params['pageIndex'] || 0;
      this.searchInput.setValue(params['searchInput'] || '');
      this.checkboxComponent.form.controls.brand.setValue(params['brand'] ? params['brand'].split(',') : []);
      // Number arrays must be converted back to numbers from strings.
      this.checkboxComponent.form.controls.clampDiameter.setValue(params['clampDiameter'] ? params['clampDiameter'].split(',').map((x: string): number => +x) : []);
      this.checkboxComponent.form.controls.color.setValue(params['color'] ? params['color'].split(',') : []);
      this.checkboxComponent.form.controls.length.setValue(params['length'] ? params['length'].split(',').map((x: string): number => +x) : []);
      this.checkboxComponent.form.controls.material.setValue(params['material'] ? params['material'].split(',') : []);
      this.checkboxComponent.form.controls.rise.setValue(params['rise'] ? params['rise'].split(',').map((x: string): number => +x) : []);
      this.checkboxComponent.form.controls.steererDiameter.setValue(params['steererDiameter'] ? params['steererDiameter'].split(',') : []);
      this.rangeComponent.form.controls.priceRange.controls.min.setValue(params['priceMin']);
      this.rangeComponent.form.controls.priceRange.controls.max.setValue(params['priceMax']);
      this.rangeComponent.form.controls.weightRange.controls.min.setValue(params['weightMin']);
      this.rangeComponent.form.controls.weightRange.controls.max.setValue(params['weightMax']);
    });

    this.categoriesLocal = this.checkboxComponent.categories;
    this.cd.detectChanges(); // Run Change Detection manually to make the view update based on this changed value

    // Reset paginator to the first page on state changes
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.searchInput.valueChanges.pipe(debounceTime(500)).subscribe(() => this.paginator.pageIndex = 0);
    this.checkboxComponent.form.valueChanges.subscribe(() => this.paginator.pageIndex = 0);
    this.rangeComponent.form.controls.priceRange.valueChanges.pipe(debounceTime(500)).subscribe(() => this.paginator.pageIndex = 0);
    this.rangeComponent.form.controls.weightRange.valueChanges.pipe(debounceTime(500)).subscribe(() => this.paginator.pageIndex = 0);

    // You could make the formgroup contain all the checkboxes and the range filters and debounce both

    merge(this.sort.sortChange, this.paginator.page, this.searchInput.valueChanges.pipe(
      debounceTime(500)),
      this.checkboxComponent.form.valueChanges,
      this.rangeComponent.form.valueChanges.pipe(debounceTime(500)))
      .pipe(
        tap(() => this.updateQueryParameters()), // Runs whenever any of the merged observables emit
        tap((x) => console.log('tap: ', x)), 
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getStems(
            this.sort.direction,
            this.sort.active,
            this.paginator.pageSize,
            this.paginator.pageIndex,
            this.searchInput.value,
            this.checkboxComponent.form.value as StemCheckboxForm,
            this.rangeComponent.form.controls.priceRange.value as RangeFilter,
            this.rangeComponent.form.controls.weightRange.value as RangeFilter
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
      .subscribe(data => {
        this.data = data;
      });
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
    console.log('activatedRoute: ', this.route.snapshot);
  }

  logItem(x: any) {
    console.log(x);
  }
}

export class ExampleHttpDatabase {
  constructor(private http: HttpClient) { }

  baseURL = 'http://localhost:8080/graphql?query='; // local
  // baseURL = 'https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query='; // Dgraph Cloud

  defaultRangeFilter: number[] = [0, 100000];

  getStems(
    order: SortDirection,
    column: string,
    pageSize: number,
    pageIndex: number,
    search: string,
    checkboxFilters: StemCheckboxForm,
    prices: RangeFilter,
    weights: RangeFilter
  ): Observable<Stems[]> {

    // Because weight can be null, if you have min: 0, max: 100000 always set by default, then you will never see items with a weight of null
    // That's why the extra weights.min || weights.max check must be performed
    const requestURL = this.baseURL + `{ 

  aggregateStems(filter: {name: ${search ? '{alloftext: \"' + search + '\"}' : '{}'}, 
    
  brand: ${(checkboxFilters.brand.length !== 0) ? '{in: [\"' + checkboxFilters.brand.join('", "') + '\"]}' : '{}'}, 
  
  clampDiameter: ${(checkboxFilters.clampDiameter.length !== 0) ? '{in: [' + checkboxFilters.clampDiameter + ']}' : '{}'},
  
  color: ${(checkboxFilters.color.length !== 0) ? '{in: [\"' + checkboxFilters.color.join('", "') + '\"]}' : '{}'}, 
  
  length: ${(checkboxFilters.length.length !== 0) ? '{in: [' + length + ']}' : '{}'}, 
  
  material: ${(checkboxFilters.material.length !== 0) ? '{in: [\"' + checkboxFilters.material.join('", "') + '\"]}' : '{}'},
  
  rise: ${(checkboxFilters.rise.length !== 0) ? '{in: [' + checkboxFilters.rise + ']}' : '{}'},
  
  steererDiameter: ${(checkboxFilters.steererDiameter.length !== 0) ? '{in: [\"' + checkboxFilters.steererDiameter.join('", "') + '\"]}' : '{}'},
  
  price: {between: {min: ${prices.min ? prices.min : 0}, max: ${prices.max ? prices.max : 100000}}},

  weight: ${weights.min || weights.max ? '{between: {min:' + (weights.min ? weights.min : 0) + ', max: ' + (weights.max ? weights.max : 100000) + '}}' : '{}'}}) { count }
  
   queryStems(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex * pageSize}, filter: {name: ${search ? '{alloftext: \"' + search + '\"}' : '{}'}, 
   
   brand: ${(checkboxFilters.brand.length !== 0) ? '{in: [\"' + checkboxFilters.brand.join('", "') + '\"]}' : '{}'}, 
   
   clampDiameter: ${(checkboxFilters.clampDiameter.length !== 0) ? '{in: [' + checkboxFilters.clampDiameter + ']}' : '{}'},
  
   length: ${(checkboxFilters.length.length !== 0) ? '{in: [' + length + ']}' : '{}'}, 
   
   color: ${(checkboxFilters.color.length !== 0) ? '{in: [\"' + checkboxFilters.color.join('", "') + '\"]}' : '{}'}, 
   
   material: ${(checkboxFilters.material.length !== 0) ? '{in: [\"' + checkboxFilters.material.join('", "') + '\"]}' : '{}'}, 
   
   rise: ${(checkboxFilters.rise.length !== 0) ? '{in: [' + checkboxFilters.rise + ']}' : '{}'}, 
   
   steererDiameter: ${(checkboxFilters.steererDiameter.length !== 0) ? '{in: [\"' + checkboxFilters.steererDiameter.join('", "') + '\"]}' : '{}'}, 
   
   price: {between: {min: ${prices.min ? prices.min : 0}, max: ${prices.max ? prices.max : 100000}}}, 
   
   weight: ${weights.min || weights.max ? '{between: {min:' + (weights.min ? weights.min : 0) + ', max: ' + (weights.max ? weights.max : 100000) + '}}' : '{}'}})
   
    { link clampDiameter brand color image length material name price rise steererDiameter weight } }`;
    // Why doesn't this work?
    // this.http.get('data-from-cyclery/competitive-cyclist-stems.json').subscribe(x => console.log(x));
    // console.log(requestURL);
    return this.http.get<Stems[]>(requestURL);
  }
}