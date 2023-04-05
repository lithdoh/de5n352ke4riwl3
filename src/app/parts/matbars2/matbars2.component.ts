import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, debounceTime, map, merge, of, startWith, switchMap, tap } from 'rxjs';
import { RangeFilter } from 'src/app/models/range-filter';
import { Bars } from '../../models/bars.model';
import { RangeFiltersComponent } from '../range-filters/range-filters/range-filters.component';
import { FilterCategories, StemCheckboxFiltersComponent } from '../stem-checkbox-filters/stem-checkbox-filters.component';
import { BarCheckboxFiltersComponent } from '../bar-checkbox-filters/bar-checkbox-filters.component';

interface BarCheckboxForm {
  brand: string[];
  diameter: number[];
  rise: number[];
  upsweep: number[];
  backsweep: number[];
  width: number[];
  color: string[];
  material: string[];
}

@Component({
  selector: 'app-matbars2',
  templateUrl: './matbars2.component.html',
  styleUrls: ['./matbars2.component.css']
})
export class Matbars2Component {
  // api = inject(ApiService);

  displayedColumns: string[] = [
    'image',
    'name',
    'brand',
    'diameter',
    'rise',
    'upsweep',
    'backsweep',
    'width',
    'color',
    'material',
    'weight',
    'price',
    'add'
  ];
  exampleDatabase: ExampleHttpDatabase = new ExampleHttpDatabase(this._httpClient);
  data: Bars[] = [];

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

  @ViewChild(BarCheckboxFiltersComponent) barCheckboxComponent!: BarCheckboxFiltersComponent;


  @ViewChild(RangeFiltersComponent) rangeComponent!: RangeFiltersComponent;

  categoriesLocal!: FilterCategories;

  newRemoveSelection(section: string, name: string | number | null): void {
    const formSection = this.barCheckboxComponent.form.get(section) as FormControl;
    const index = formSection.value.indexOf(name);

    formSection.setValue([
      ...formSection.value.slice(0, index),
      ...formSection.value.slice(index + 1),
    ]);
  };

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private _httpClient: HttpClient,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  updateQueryParameters() {
    const barCheckboxFormControls = this.barCheckboxComponent.form.controls;
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
          brand: barCheckboxFormControls['brand'].value.length !== 0 ? barCheckboxFormControls['brand'].value.join(',') : null,
          diameter: barCheckboxFormControls['diameter'].value.length !== 0 ? barCheckboxFormControls['diameter'].value.join(',') : null,
          rise: barCheckboxFormControls['rise'].value.length !== 0 ? barCheckboxFormControls['rise'].value.join(',') : null,
          upsweep: barCheckboxFormControls['upsweep'].value.length !== 0 ? barCheckboxFormControls['upsweep'].value.join(',') : null,
          backsweep: barCheckboxFormControls['backsweep'].value.length !== 0 ? barCheckboxFormControls['backsweep'].value.join(',') : null,
          width: barCheckboxFormControls['width'].value.length !== 0 ? barCheckboxFormControls['width'].value.join(',') : null,
          color: barCheckboxFormControls['color'].value.length !== 0 ? barCheckboxFormControls['color'].value.join(',') : null,
          material: barCheckboxFormControls['material'].value.length !== 0 ? barCheckboxFormControls['material'].value.join(',') : null,
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
      // Number arrays must be converted back to numbers from strings.
      this.barCheckboxComponent.form.controls.brand.setValue(params['brand'] ? params['brand'].split(',') : []);
      this.barCheckboxComponent.form.controls.diameter.setValue(params['diameter'] ? params['diameter'].split(',').map((x: string): number => +x) : []);
      this.barCheckboxComponent.form.controls.rise.setValue(params['rise'] ? params['rise'].split(',').map((x: string): number => +x) : []);
      this.barCheckboxComponent.form.controls.upsweep.setValue(params['upsweep'] ? params['upsweep'].split(',').map((x: string): number => +x) : []);
      this.barCheckboxComponent.form.controls.backsweep.setValue(params['backsweep'] ? params['backsweep'].split(',').map((x: string): number => +x) : []);
      this.barCheckboxComponent.form.controls.width.setValue(params['width'] ? params['width'].split(',').map((x: string): number => +x) : []);
      this.barCheckboxComponent.form.controls.color.setValue(params['color'] ? params['color'].split(',') : []);
      this.barCheckboxComponent.form.controls.material.setValue(params['material'] ? params['material'].split(',') : []);
      this.rangeComponent.form.controls.priceRange.controls.min.setValue(params['priceMin']);
      this.rangeComponent.form.controls.priceRange.controls.max.setValue(params['priceMax']);
      this.rangeComponent.form.controls.weightRange.controls.min.setValue(params['weightMin']);
      this.rangeComponent.form.controls.weightRange.controls.max.setValue(params['weightMax']);
    });

    this.categoriesLocal = this.barCheckboxComponent.categories;
    this.cd.detectChanges(); // Run Change Detection manually to make the view update based on this changed value

    // Reset paginator to the first page on state changes
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.searchInput.valueChanges.pipe(debounceTime(500)).subscribe(() => this.paginator.pageIndex = 0);
    this.barCheckboxComponent.form.valueChanges.subscribe(() => this.paginator.pageIndex = 0);
    this.rangeComponent.form.controls.priceRange.valueChanges.pipe(debounceTime(500)).subscribe(() => this.paginator.pageIndex = 0);
    this.rangeComponent.form.controls.weightRange.valueChanges.pipe(debounceTime(500)).subscribe(() => this.paginator.pageIndex = 0);

    // You could make the formgroup contain all the checkboxes and the range filters and debounce both

    merge(this.sort.sortChange, this.paginator.page, this.searchInput.valueChanges.pipe(
      debounceTime(500)),
      this.barCheckboxComponent.form.valueChanges,
      this.rangeComponent.form.valueChanges.pipe(debounceTime(500)))
      .pipe(
        tap(() => this.updateQueryParameters()), // Runs whenever any of the merged observables emit
        tap((x) => console.log('tap: ', x)),
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getBars(
            this.sort.direction,
            this.sort.active,
            this.paginator.pageSize,
            this.paginator.pageIndex,
            this.searchInput.value,
            this.barCheckboxComponent.form.value as BarCheckboxForm,
            this.rangeComponent.form.controls.priceRange.value as RangeFilter,
            this.rangeComponent.form.controls.weightRange.value as RangeFilter
          ).pipe(catchError(() => of(null)),
            map((response: any) => { this.length = response.data.aggregateBars.count; return response.data.queryBars }));
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
  addItem(stemObject: Bars) {
    const stemString: string = JSON.stringify(stemObject);

    /*   Should I put this in a "try...catch" block because it says
    "Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set."? */
    localStorage.setItem('bar', stemString);

    this.router.navigate(['/parts/chain']);
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

  getBars(
    order: SortDirection,
    column: string,
    pageSize: number,
    pageIndex: number,
    search: string,
    checkboxFilters: BarCheckboxForm,
    prices: RangeFilter,
    weights: RangeFilter
  ): Observable<Bars[]> {

    // Because weight can be null, if you have min: 0, max: 100000 always set by default, then you will never see items with a weight of null
    // That's why the extra weights.min || weights.max check must be performed
    const requestURL = this.baseURL + `{ 

  aggregateBars(filter: {name: ${search ? '{alloftext: \"' + search + '\"}' : '{}'}, 
    
  brand: ${(checkboxFilters.brand.length !== 0) ? '{in: [\"' + checkboxFilters.brand.join('", "') + '\"]}' : '{}'}, 
  
  diameter: ${(checkboxFilters.diameter.length !== 0) ? '{in: [' + checkboxFilters.diameter + ']}' : '{}'},
  
  rise: ${(checkboxFilters.rise.length !== 0) ? '{in: [' + checkboxFilters.rise + ']}' : '{}'},
  
  upsweep: ${(checkboxFilters.upsweep.length !== 0) ? '{in: [' + checkboxFilters.upsweep + ']}' : '{}'},
  
  backsweep: ${(checkboxFilters.backsweep.length !== 0) ? '{in: [' + checkboxFilters.backsweep + ']}' : '{}'},

  color: ${(checkboxFilters.color.length !== 0) ? '{in: [\"' + checkboxFilters.color.join('", "') + '\"]}' : '{}'}, 
  
  width: ${(checkboxFilters.width.length !== 0) ? '{in: [' + checkboxFilters.width + ']}' : '{}'}, 
  
  material: ${(checkboxFilters.material.length !== 0) ? '{in: [\"' + checkboxFilters.material.join('", "') + '\"]}' : '{}'},
  
  price: {between: {min: ${prices.min ? prices.min : 0}, max: ${prices.max ? prices.max : 100000}}},

  weight: ${weights.min || weights.max ? '{between: {min:' + (weights.min ? weights.min : 0) + ', max: ' + (weights.max ? weights.max : 100000) + '}}' : '{}'}}) { count }
  
   queryBars(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex * pageSize}, filter: {name: ${search ? '{alloftext: \"' + search + '\"}' : '{}'}, 
   
   brand: ${(checkboxFilters.brand.length !== 0) ? '{in: [\"' + checkboxFilters.brand.join('", "') + '\"]}' : '{}'}, 
   
   diameter: ${(checkboxFilters.diameter.length !== 0) ? '{in: [' + checkboxFilters.diameter + ']}' : '{}'},
   
   rise: ${(checkboxFilters.rise.length !== 0) ? '{in: [' + checkboxFilters.rise + ']}' : '{}'}, 
   
   upsweep: ${(checkboxFilters.upsweep.length !== 0) ? '{in: [' + checkboxFilters.upsweep + ']}' : '{}'}, 
   
   backsweep: ${(checkboxFilters.backsweep.length !== 0) ? '{in: [' + checkboxFilters.backsweep + ']}' : '{}'}, 
  
   width: ${(checkboxFilters.width.length !== 0) ? '{in: [' + checkboxFilters.width + ']}' : '{}'}, 
   
   color: ${(checkboxFilters.color.length !== 0) ? '{in: [\"' + checkboxFilters.color.join('", "') + '\"]}' : '{}'}, 
   
   material: ${(checkboxFilters.material.length !== 0) ? '{in: [\"' + checkboxFilters.material.join('", "') + '\"]}' : '{}'},
   
   price: {between: {min: ${prices.min ? prices.min : 0}, max: ${prices.max ? prices.max : 100000}}}, 

   weight: ${weights.min || weights.max ? '{between: {min:' + (weights.min ? weights.min : 0) + ', max: ' + (weights.max ? weights.max : 100000) + '}}' : '{}'}})
   
    { link image name brand diameter rise upsweep backsweep width color material weight price } }`;

    console.log('matbars requestURL: ', requestURL);
    return this.http.get<Bars[]>(requestURL);
  }
}
