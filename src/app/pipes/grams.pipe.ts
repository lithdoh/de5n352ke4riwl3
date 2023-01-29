import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'grams'
})
export class GramsPipe implements PipeTransform {

  transform(value: number): string | number {
    if (value) {
      return value + ' g';
    } 
    return value;
  }

}
