import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dollarsPerGram'
})
export class DollarsPerGramPipe implements PipeTransform {

  transform(value: number): string | number {
    if (value) {
      return value + ' $/g'
    }
    return value;
  }

}
