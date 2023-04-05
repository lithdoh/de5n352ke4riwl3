import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Stems } from 'src/app/models/stems.model';
import { Bars } from 'src/app/models/bars.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseURL = 'http://localhost:8080/graphql?query=';
  // baseURL = 'https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query=';
  stemRequestURL =
    this.baseURL +
    `{queryStems { brand color length material rise steererDiameter clampDiameter }}`;

  stems$ = inject(HttpClient)
    .get<StemResponse>(this.stemRequestURL)
    .pipe(map(({ data: { queryStems } }) => queryStems));
  
  barRequestURL =
    this.baseURL +
    `{queryBars { upsweep rise material diameter color brand backsweep width }}`;

  bars$ = inject(HttpClient)
    .get<BarResponse>(this.barRequestURL)
    .pipe(map(({ data: { queryBars } }) => queryBars));
}

type StemResponse = {
  data: {
    queryStems: Stems[];
  };
}

type BarResponse = {
  data: {
    queryBars: Bars[];
  };
}
