import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dollarsPerGram'
})
export class DollarsPerGramPipe implements PipeTransform {

  constructor(
    // private numPipe: DecimalPipe
    ) {}

  transform(value: number): string | number {
    // const result = this.numPipe.transform(value);
    if (value) {
      return value + ' $/g'
    }
    return value;
  }

}
