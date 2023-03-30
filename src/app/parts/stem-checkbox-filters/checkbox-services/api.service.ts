import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Stems } from 'src/app/models/stems.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseURL =
    'https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query=';
  requestURL =
    this.baseURL +
    `{queryStems { brand color length material rise steererDiameter clampDiameter }}`;

  stems$ = inject(HttpClient)
    .get<StemResponse>(this.requestURL)
    .pipe(map(({ data: { queryStems } }) => queryStems));
}

type StemResponse = {
  data: {
    queryStems: Stems[];
  };

}
