import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {Observable, startWith, Subscription, switchMap} from 'rxjs';
import {StemsService} from 'src/app/services/stems.service';
import {Stems} from "../../models/stems.model";
import {DataSource} from "@angular/cdk/collections";

@Component({
  selector: 'app-matstems',
  templateUrl: './matstems.component.html',
  styleUrls: ['./matstems.component.css'],
})
export class MatstemsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: StemsDataSource;

  stems$!: Subscription;

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
  // From talk with Steve
  // @Output() id: EventEmitter<any> = new EventEmitter();

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private stemsService: StemsService
  ) {}

  ngOnInit(): void {
    // this.stemsService.getStems('asc').subscribe(data => {
    //   this.testDataSource.data = data;
    //   this.testDataSource.sort = this.sort;
    // })
  }

  ngAfterViewInit() {
    this.dataSource = new StemsDataSource(this.stemsService, this.sort);
  }

  ngOnDestroy() {
    this.stems$.unsubscribe();
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

  /** Adding products to the list: */
  onAddItem() {
    // “add” button invokes function (event binding in matstems template)
    // function accesses the list of stems (stem component)

    /* From talk with Steve
     this.id.emit(id);
    */

    // and adds a product to the build list (home component)

    // route to the page
    this.router.navigate(['/parts/chain']);
  }

  // Alternatively:
  // When you click the add button, the id of the item is stored, and you are redirected to the "list" page.
  // On the list page, a request is sent to the database for the item with the stored id.
  // That item is displayed.
  // Another way
  // When you click the add button, the item whose add button you clicked is stored as an object, and you are redirected to the "list" page
  // That item is displayed.
}


export class StemsDataSource extends DataSource<any> {
  constructor(private stemsService: StemsService,
              private sort: MatSort) {
    super();
  }
  connect(): Observable<Stems[]> {
    // here is the issue: I can manually write 'asc' or 'desc' and it works, but the sort direction needs to be changed when the
    // arrows on the table headers are clicked
    // return this.stemsService.getStems('asc', 'price');

    const DEFAULT_DIR = 'asc';
    const DEFAULT_COLUMN = 'name';

    return this.sort.sortChange.pipe(
      startWith({direction: DEFAULT_DIR, active: DEFAULT_COLUMN} as Sort),
      switchMap(({direction, active}: Sort) => this.stemsService.getStems(direction, active)),
    )
  }
  disconnect() {}
}
