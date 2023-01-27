import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { Router } from '@angular/router';
import { startWith, switchMap, catchError, map, Observable, of, merge, tap } from 'rxjs';
import { Stems } from 'src/app/models/stems.model';

@Component({
  selector: 'app-matstems2',
  templateUrl: './matstems2.component.html',
  styleUrls: ['./matstems2.component.css']
})
export class Matstems2Component implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    // 'id',
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

  totalRows = 27;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  showFirstLastButtons = true;
  isLoadingResults = true;

  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private _httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);
  }
  
  ngAfterViewInit() {
    this.exampleDatabase.getStems('asc', 'name', 5, 0).pipe(tap(x => console.log(x))).subscribe(data => (this.data = data));
    
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({direction: 'asc', active: 'name'} as Sort, {pageIndex: 0, pageSize: 5} as PageEvent),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getStems(
            this.sort.direction,
            this.sort.active,
            this.paginator.pageSize,
            this.paginator.pageIndex,
          ).pipe(catchError(() => of(null)));
        }),

        map(data => {
          this.isLoadingResults = false;
          if (data === null) {
            return [];
          }
          return data;
        }),
      )
      .subscribe(data => (this.data = data));
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
}

export class ExampleHttpDatabase {

  constructor(private http: HttpClient) {}

  getStems(order: SortDirection, column: string, pageSize: number, pageIndex: number): Observable<Stems[]> {
    const baseURL = 'https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query=';
    const requestURL = baseURL + `{ queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize}) { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } }`;
    return this.http.get<Stems[]>(requestURL).pipe(map((response: any) => response.data.queryStem));
  }
}