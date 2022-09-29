import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MyServiceService } from 'src/app/my-service.service';
import { HttpClient } from '@angular/common/http';
import { Part } from '../parts/part.model';
import { map } from 'rxjs/operators';

export interface Stems {
  image: string;
  name: string;
  brand: string;
  model: string;
  barClampDiameter: number;
  length: number;
  rise: number;
  steererTubeDiameter: string;
  color: string;
  material: string;
  price: number;
  weight: number;
  where: string;
}

const STEM_DATA: Stems[] = [
  {
    image: 'https://www.sram.com/globalassets/image-hierarchy/sram-product-root-images/stems/stems/st-desc-direct-mount-35-b1/black3ql.jpg?w=800&quality=80&format=jpg',
    name: 'Descendant 35mm Direct Mount Stem',
    brand: 'Truvativ',
    model: 'ST-DESC-DM5-B1',
    barClampDiameter: 35,
    length: 50,
    rise: 0,
    steererTubeDiameter: 'Direct Mount',
    color: 'Black',
    material: 'Al-7075',
    price: 81,
    weight: 233,
    where: 'sram.com',
  },
  {
    image: 'https://www.sram.com/globalassets/image-hierarchy/sram-product-root-images/stems/stems/st-hussefelt-a1/2012-truvativhussefeltstem-large-en?w=800&quality=80&format=jpg',
    name: 'Hussefelt Stem',
    brand: 'Truvativ',
    model: 'ST-HUSS-A1',
    barClampDiameter: 31.8,
    length: 40,
    rise: 0,
    steererTubeDiameter: '1-1/8 in',
    color: 'Blast Black',
    material: 'Al-7075',
    price: 42,
    weight: 233,
    where: 'sram.com',
  },
];

@Component({
  selector: 'app-gqlmatstems',
  templateUrl: './gqlmatstems.component.html',
  styleUrls: ['./gqlmatstems.component.css']
})
export class GqlmatstemsComponent implements AfterViewInit {

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
  dataSource = new MatTableDataSource(STEM_DATA);

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public myService: MyServiceService,
    private router: Router,
    private http: HttpClient,
  ) { }


  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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

  onAddItem() {
    // “add” button calls function (event binding in matstems template)
    // function accesses the list of stems (stem component)

    // and adds a product to the build list (home component)

    // route to the page
    this.router.navigate(['/parts/chain'])
  }

  posts: any;

  onFetchPosts() {
    // Send Http request
    this.posts = this.http
      .get('https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query={ queryStem { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } } ')
      .pipe(map((response: any) => response.data.queryStem))
      .subscribe(posts => {
        this.posts = posts;
      });
      // .pipe(
      //   map(responseData => {
      //     const postsArray = [];
      //     for (const key in responseData) {
      //       if (responseData.hasOwnProperty(key))
      //       postsArray.push({ ...responseData[key], id: key })
      //     }
      //     return postsArray;
      // })
      //   )
  }
}
