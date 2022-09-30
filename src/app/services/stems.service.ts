import { Injectable } from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { map, Observable }   from 'rxjs';
import { Stems } from '../models/stems.model';

@Injectable({
  providedIn: 'root'
})
export class StemsService {
  private serviceUrl = 'https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query={ queryStem { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } }';

  constructor(private http: HttpClient) { }

  getStems(sort: string, order: SortDirection, page: number): Observable<Stems[]> {
    const requestURL = `${this.serviceUrl}?q=repo:angular/components&sort=${sort}&order=${order}&page=${
      page + 1
    }`
    return this.http.get<Stems[]>(requestURL).pipe(map((response: any) => response.data.queryStem));
  }
}
