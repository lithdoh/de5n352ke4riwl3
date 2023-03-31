import { LiveAnnouncer } from '@angular/cdk/a11y';
import { KeyValue } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { Router } from '@angular/router';
import { catchError, debounceTime, map, merge, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { Stems } from '../../models/stems.model';

interface StemFilters {
  brands: string[];
  clampDiameters: number[];
  lengths: string[];
  rises: number[];
  steererDiameters: string[];
  colors: string[];
  materials: string[];
}

@Component({
  selector: 'app-matstems4',
  templateUrl: './matstems4.component.html',
  styleUrls: ['./matstems4.component.css']
})
export class Matstems4Component {
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
  exampleDatabase: ExampleHttpDatabase = new ExampleHttpDatabase(this.http);
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

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
  ) { }

  // NonNullable so that when the formGroups are reset, all values become false instead of null. They need to be false because the someComplete() method checks if all of them are false
  nnfb = new FormBuilder().nonNullable;

  profileForm!: any;

  // compareFn from https://www.tektutorialshub.com/angular/angular-keyvalue-pipe/ (modified)
  numberCompareFn = (
    a: KeyValue<number, string>,
    b: KeyValue<number, string>
  ): number => {
    // return a.value > b.value ? -1 : 1;
    // return 0; Also makes it so that the numeric filters are in asc order, it's just the fact that you have a sorting function that is not the default, which sorts them lexicographically
    return 0;
  };

  ngOnInit() {
    const baseURL =
      'https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query=';
    const requestURL =
      baseURL +
      `{queryStems { brand color length material rise steererDiameter clampDiameter }}`;
    console.log(requestURL);

    this.http
      .get(requestURL)
      .pipe(
        map((response: any) => response.data.queryStems),
        map((allStems) => {
          // console.log(allStems);
          // console.log('firstStem:', allStems[0]);
          const categoriesObj: StemFilters = {
            brands: [],
            colors: [],
            lengths: [],
            materials: [],
            rises: [],
            steererDiameters: [],
            clampDiameters: [],
          };
          for (const stems of allStems) {
            categoriesObj.brands.push(stems.brand);
            categoriesObj.colors.push(stems.color);
            categoriesObj.lengths.push(stems.length);
            categoriesObj.materials.push(stems.material);
            categoriesObj.rises.push(stems.rise);
            categoriesObj.steererDiameters.push(stems.steererDiameter);
            categoriesObj.clampDiameters.push(stems.clampDiameter);
          }

          categoriesObj.brands = [...new Set(categoriesObj.brands.sort())];
          categoriesObj.colors = [
            ...new Set(categoriesObj.colors.sort().filter((x) => x !== null)),
          ];
          categoriesObj.lengths = [
            ...new Set(categoriesObj.lengths.filter((x) => x !== null)),
          ];
          categoriesObj.materials = [
            ...new Set(categoriesObj.materials.sort()),
          ];
          categoriesObj.rises = [
            ...new Set(categoriesObj.rises.filter((x) => x !== null)),
          ];
          categoriesObj.steererDiameters = [
            ...new Set(
              categoriesObj.steererDiameters.sort().filter((x) => x !== null)
            ),
          ];
          categoriesObj.clampDiameters = [
            ...new Set(categoriesObj.clampDiameters.filter((x) => x !== null)),
          ];

          const categoryDefaults: any = {
            brands: {},
            colors: {},
            lengths: {},
            materials: {},
            rises: {},
            steererDiameters: {},
            clampDiameters: {},
          };
          for (const key in categoriesObj) {
            for (const filterOption of categoriesObj[
              key as keyof typeof categoriesObj
            ]) {
              categoryDefaults[key][filterOption] = false;
            }
          }
          // console.log('categoryDefaults', categoryDefaults);
          return categoryDefaults;
        })
      )
      .subscribe((x) => {
        this.profileForm = this.nnfb.group({
          brands: this.nnfb.group(x.brands),
          colors: this.nnfb.group(x.colors),
          lengths: this.nnfb.group(x.lengths),
          materials: this.nnfb.group(x.materials),
          rises: this.nnfb.group(x.rises),
          steererDiameters: this.nnfb.group(x.steererDiameters),
          clampDiameters: this.nnfb.group(x.clampDiameters),
        });
      });
      console.log(this.profileForm)
  }

  // Uncomment for select All only checkbox strategy
  /*   uncheckAll(section: any) {
    this.profileForm.controls[section].reset();
  }

  allUnChecked(section: any): boolean {
    return Object.values(this.profileForm.controls[section].value).every(
      (x) => x === false
    );
  } */

  allChecked(section: any): boolean {
    return Object.values(this.profileForm.controls[section].value).every(
      (x) => x === true
    );
  }

  someChecked(section: any): boolean {
    return (
      Object.values(this.profileForm.controls[section].value).some(
        (x) => x === true
      ) &&
      !Object.values(this.profileForm.controls[section].value).every(
        (x) => x === true
      )
    );
  }

  setAll(completed: boolean, section: any) {
    if (this.profileForm.controls[section] == null) {
      return;
    }
    const arr = Object.keys(this.profileForm.controls[section].value);
    const obj: { [key: string]: boolean } = {};
    arr.forEach((element) => {
      obj[element] = completed;
    });
    this.profileForm.controls[section].setValue(obj);
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

  log(x: any) {
    console.log(x);
  }
  logItem() {
    console.log('testing');
  }

  brandsList: string[] = [];
  lengthsList: string[] = [];
  colorsList: string[] = [];
  materialsList: string[] = [];

  //______________________________________________________________________________________________

  // Trying to make the form go to the child component for DRYness
  // @Output() testingProfForm: FormGroup = this.fb.group({
  //   Renthal: false,
  //   Truvativ: false,
  //   'Industry Nine': false,
  //   Campy: false,
  //   Zipp: false,
  //   Spank: false,
  // });

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
        map((x: {[key: string]: boolean}) => {
          this.brandsList = Object.entries(x).sort()
            .filter(([_, isSelected]) => isSelected)
            .map(([key]) => key);
            console.log(x)
          return this.brandsList;
          }
        )
      ), 
      this.profileForm.controls.lengths.valueChanges
      .pipe(
        map((x: {[key: string]: boolean}) => {
          this.lengthsList = Object.entries(x).sort()
            .filter(([_, isSelected]) => isSelected)
            .map(([key]) => key);
          return this.lengthsList;
          }
        )
      ), 
      this.profileForm.controls.colors.valueChanges
      .pipe(
        map((x: {[key: string]: boolean}) => {
          this.colorsList = Object.entries(x).sort()
            .filter(([_, isSelected]) => isSelected)
            .map(([key]) => key);
          return this.colorsList;
          }
        )
      ),
      this.profileForm.controls.materials.valueChanges
      .pipe(
        map((x: {[key: string]: boolean}) => {
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

  logger(x: any) {
    console.log(x);
  }
}

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