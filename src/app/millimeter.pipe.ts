import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millimeter'
})
export class MillimeterPipe implements PipeTransform {

  transform(value: number): string {
    return value + 'mm';
  }

}
