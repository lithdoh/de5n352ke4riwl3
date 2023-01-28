import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { map, Observable } from 'rxjs';
import { Stems } from '../models/stems.model';

@Injectable({
  providedIn: 'root'
})
export class StemsService {
  // private serviceUrl = 'query { queryStem(filter: {brand: {alloftext: "Renthal"}}, first: 2, offset: 0, order: {asc: length}) { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } } ';

  constructor(private http: HttpClient) { }

  // Sorting only
  getStems(order: SortDirection, column: string): Observable<Stems[]> {
    const baseURL = 'https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query=';
    const requestURL = baseURL + `{ queryStem(order: {${order}: ${column}}) 
    { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } }`;
    console.log(requestURL);
    return this.http.get<Stems[]>(requestURL).pipe(map((response: any) => response.data.queryStem));
  }
    
  // Pagination only
  // getStems(pageSize: number, pageIndex: number): Observable<Stems[]> {
  //   const baseURL = 'https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query=';
  //   const requestURL = baseURL + `{ queryStem(order: {asc: name}, first: ${pageSize}, offset: ${pageIndex*pageSize}) 
  //   { barClampDiameter brand color image length material model name rise price steererTubeDiameter weight where } aggregateStem { count }}`;

  //   // let count1;
  //   // this.http.get<Stems[]>(requestURL).pipe(map((response: any) => response.data.aggregateStem)).subscribe(x => count1 = x);
  //   // console.log(count1);

  //   return this.http.get<Stems[]>(requestURL).pipe(map((response: any) => response.data.queryStem));
  // }

  // Sorting and Pagination
  // getStems(order: SortDirection, column: string, pageSize: number, pageIndex: number): Observable<Stems[]> {
  //   const baseURL = 'https://throbbing-field-240145.us-west-2.aws.cloud.dgraph.io/graphql?query=';
  //   const requestURL = `{ queryStem(order: {${order}: ${column}}, first: ${pageSize}, offset: ${pageIndex*pageSize}) { barClampDiameter brand color image length material model name price rise steererTubeDiameter weight where } }`;
  //   return this.http.get<Stems[]>(requestURL).pipe(map((response: any) => response.data.queryStem));
  // }
}

