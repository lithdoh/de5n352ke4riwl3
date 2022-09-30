import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Stems } from 'src/app/models/stems.model';
import { StemsService } from 'src/app/services/stems.service';

@Component({
  selector: 'app-matstems',
  templateUrl: './matstems.component.html',
  styleUrls: ['./matstems.component.css'],
})

export class MatstemsComponent implements OnInit {
  dataSource = new StemsDataSource(this.stemsService);

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
    'add'
  ];

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private stemsService: StemsService,
    ) {}

    ngOnInit(): void {
    }

  @ViewChild(MatSort) sort!: MatSort;

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

  onAddItem() {
    // “add” button calls function (event binding in matstems template)
    // function accesses the list of stems (stem component)

    // and adds a product to the build list (home component)

    // route to the page
    this.router.navigate(['/parts/chain'])
  }
}

export class StemsDataSource extends DataSource<any> {
  constructor(private stemsService: StemsService) {
    super();
  }
  connect(): Observable<Stems[]> {
    return this.stemsService.getStems();
  }
  disconnect() {}
}
