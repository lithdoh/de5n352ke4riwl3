import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {

  counter: number = 0;

  increment() {
    this.counter++;
  }
  constructor() { }
}
